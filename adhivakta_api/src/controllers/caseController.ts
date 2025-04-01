import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Case from '../models/Case';
import User from '../models/User';
import logger from '../utils/logger';
import { ICase } from '../models/Case';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

// Helper function to validate case access
const validateCaseAccess = async (userId: string, caseId: string, isLawyer: boolean) => {
  const foundCase = await Case.findById(caseId)
    .populate('petitioner', 'id')
    .populate('lawyers', 'id');

  if (!foundCase) {
    return { valid: false, status: 404, message: 'Case not found' };
  }

  // Check if user is petitioner or assigned lawyer
  const isPetitioner = foundCase.petitioner._id.toString() === userId;
  const isAssignedLawyer = isLawyer && 
    foundCase.lawyers.some(l => l._id.toString() === userId);

  if (!isPetitioner && !isAssignedLawyer) {
    return { valid: false, status: 403, message: 'Unauthorized access to case' };
  }

  return { valid: true, case: foundCase };
};

export const createCase = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      title,
      caseNumber,
      caseType,
      courtType,
      courtHall,
      judge,
      description,
      petitionerId,
      defendant,
      defendantEmail,
      defendantPhone,
      lawyerIds,
      seniorCounsel,
      stakeholders,
      counselForRespondent,
      nextHearing,
      status
    } = req.body;

    // Validate petitioner exists
    const petitioner = await User.findById(petitionerId);
    if (!petitioner) {
      return res.status(400).json({ message: 'Invalid petitioner ID' });
    }

    // Validate lawyers exist and are lawyers
    if (lawyerIds && lawyerIds.length > 0) {
      const lawyers = await User.find({ 
        _id: { $in: lawyerIds }, 
        role: 'lawyer' 
      });
      if (lawyers.length !== lawyerIds.length) {
        return res.status(400).json({ message: 'One or more invalid lawyer IDs' });
      }
    }

    // Validate status is either 'active' or 'closed'
    if (status && !['active', 'closed'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }

    // Validate closed cases have closing date before March 29, 2025
    if (status === 'closed' && req.body.closingDate) {
      const closingDate = new Date(req.body.closingDate);
      const maxDate = new Date('2025-03-29');
      if (closingDate > maxDate) {
        return res.status(400).json({ 
          message: 'Closed cases must have a closing date before March 29, 2025' 
        });
      }
    }

    // Create new case
    const newCase = new Case({
      title,
      caseNumber,
      caseType,
      courtType,
      courtHall,
      judge,
      description,
      petitioner: petitionerId,
      defendant: {
        name: defendant,
        email: defendantEmail,
        phone: defendantPhone
      },
      lawyers: lawyerIds || [],
      seniorCounsel: seniorCounsel || false,
      stakeholders: stakeholders || [],
      counselForRespondent: counselForRespondent || [],
      nextHearing: nextHearing ? new Date(nextHearing) : null,
      status: status || 'active',
      closingDate: status === 'closed' ? new Date(req.body.closingDate) : null
    });

    await newCase.save();

    // Populate for response
    const populatedCase = await Case.findById(newCase._id)
      .populate('petitioner', 'name email phone')
      .populate('lawyers', 'name email phone')
      .populate('stakeholders', 'name email phone relation')
      .populate('counselForRespondent', 'name email phone firm');

    logger.info(`Case ${newCase.caseNumber} created by user ${req.user?.id}`);
    res.status(201).json(populatedCase);
  } catch (error: any) {
    logger.error(`Create case error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create case',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCases = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Validate and parse query parameters with defaults
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    
    const { 
      status,
      caseType,
      courtType,
      search,
      petitionerId,
      lawyerId,
      fromDate,
      toDate
    } = req.query;

    let query: mongoose.FilterQuery<ICase> = {};
    const user = req.user;

    // Role-based filtering
    if (user?.role === 'client') {
      query.petitioner = new mongoose.Types.ObjectId(user.id);
    } else if (user?.role === 'lawyer') {
      query.lawyers = new mongoose.Types.ObjectId(user.id);
    }

    // Additional filters with type validation
    if (status && ['active', 'closed'].includes(status as string)) {
      query.status = status;
    }

    if (caseType && ['civil', 'criminal', 'family', 'commercial', 'writs'].includes(caseType as string)) {
      query.caseType = caseType;
    }

    if (courtType && ['supreme', 'high', 'district', 'commercial', 'family'].includes(courtType as string)) {
      query.courtType = courtType;
    }

    // Petitioner/lawyer specific filtering (for admin users)
    if (user?.role === 'admin') {
      if (petitionerId) {
        query.petitioner = new mongoose.Types.ObjectId(petitionerId as string);
      }
      if (lawyerId) {
        query.lawyers = new mongoose.Types.ObjectId(lawyerId as string);
      }
    }

    // Date range filtering
    if (fromDate || toDate) {
      query.createdAt = {};
      if (fromDate) {
        query.createdAt.$gte = new Date(fromDate as string);
      }
      if (toDate) {
        query.createdAt.$lte = new Date(toDate as string);
      }
    }

    // Search functionality
    if (search) {
      const searchStr = search as string;
      if (searchStr.length > 2) {
        query.$or = [
          { caseNumber: { $regex: searchStr, $options: 'i' } },
          { title: { $regex: searchStr, $options: 'i' } },
          { description: { $regex: searchStr, $options: 'i' } },
          { 'defendant.name': { $regex: searchStr, $options: 'i' } },
          { 'petitioner.name': { $regex: searchStr, $options: 'i' } }
        ];
      }
    }

    // Get cases with pagination
    const [cases, total] = await Promise.all([
      Case.find(query)
        .populate('petitioner', 'name email phone')
        .populate('lawyers', 'name email phone')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      Case.countDocuments(query)
    ]);

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
        limit
      }
    });
  } catch (error: any) {
    logger.error(`Get cases error: ${error.message}`, { error });
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve cases',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCaseDetails = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caseId = req.params.id;
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';
    
    const access = await validateCaseAccess(userId!, caseId, isLawyer);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    const foundCase = await Case.findById(caseId)
      .populate('petitioner', 'name email phone')
      .populate('lawyers', 'name email phone')
      .populate('stakeholders', 'name email phone relation')
      .populate('counselForRespondent', 'name email phone firm')
      .populate('documents', 'name fileUrl createdAt')
      .populate('relatedCases', 'caseNumber title status');

    if (!foundCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    res.status(200).json({
      success: true,
      data: foundCase
    });
  } catch (error: any) {
    logger.error(`Get case details error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to retrieve case details',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const updateCase = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caseId = req.params.id;
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';
    
    const access = await validateCaseAccess(userId!, caseId, isLawyer);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    // Lawyers can only update certain fields
    const updateData = isLawyer
      ? {
          status: req.body.status,
          nextHearing: req.body.nextHearing,
          outcome: req.body.outcome,
          lawyers: req.body.lawyerIds,
          seniorCounsel: req.body.seniorCounsel
        }
      : req.body;

    // If updating status to closed, validate closing date
    if (updateData.status === 'closed' && !updateData.closingDate) {
      return res.status(400).json({ message: 'Closing date is required when closing a case' });
    }

    // If updating lawyers, validate they exist and are lawyers
    if (updateData.lawyers) {
      const lawyers = await User.find({ 
        _id: { $in: updateData.lawyers }, 
        role: 'lawyer' 
      });
      if (lawyers.length !== updateData.lawyers.length) {
        return res.status(400).json({ message: 'One or more invalid lawyer IDs' });
      }
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('petitioner', 'name email phone')
      .populate('lawyers', 'name email phone')
      .populate('stakeholders', 'name email phone relation')
      .populate('counselForRespondent', 'name email phone firm');

    logger.info(`Case ${updatedCase?.caseNumber} updated by user ${userId}`);
    res.status(200).json({
      success: true,
      data: updatedCase
    });
  } catch (error: any) {
    logger.error(`Update case error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update case',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCaseStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';

    // Base query for role-based filtering
    let baseQuery: mongoose.FilterQuery<ICase> = {};
    if (req.user?.role === 'client') {
      baseQuery.petitioner = new mongoose.Types.ObjectId(userId!);
    } else if (req.user?.role === 'lawyer') {
      baseQuery.lawyers = new mongoose.Types.ObjectId(userId!);
    }

    // Get stats
    const [activeCases, closedCases, upcomingHearings] = await Promise.all([
      Case.countDocuments({ ...baseQuery, status: 'active' }),
      Case.countDocuments({ ...baseQuery, status: 'closed' }),
      Case.countDocuments({ 
        ...baseQuery, 
        status: 'active',
        nextHearing: { 
          $gte: new Date(),
          $lte: new Date(new Date().setDate(new Date().getDate() + 7))
        }
      })
    ]);

    res.status(200).json({
      success: true,
      data: {
        activeCases,
        closedCases,
        upcomingHearings
      }
    });
  } catch (error: any) {
    logger.error(`Get case stats error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get case statistics',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getUpcomingHearings = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';

    // Base query for role-based filtering
    let baseQuery: mongoose.FilterQuery<ICase> = {
      status: 'active',
      nextHearing: { $gte: new Date() }
    };
    
    if (req.user?.role === 'client') {
      baseQuery.petitioner = new mongoose.Types.ObjectId(userId!);
    } else if (req.user?.role === 'lawyer') {
      baseQuery.lawyers = new mongoose.Types.ObjectId(userId!);
    }

    const hearings = await Case.find(baseQuery)
      .select('caseNumber title nextHearing lawyers courtType')
      .populate('lawyers', 'name')
      .sort({ nextHearing: 1 })
      .limit(5)
      .lean();

    res.status(200).json({
      success: true,
      data: hearings
    });
  } catch (error: any) {
    logger.error(`Get upcoming hearings error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get upcoming hearings',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};