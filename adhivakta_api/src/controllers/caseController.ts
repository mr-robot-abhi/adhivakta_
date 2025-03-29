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
    .populate('client', 'id')
    .populate('lawyers', 'id');

  if (!foundCase) {
    return { valid: false, status: 404, message: 'Case not found' };
  }

  // Check if user is client or assigned lawyer
  const isClient = foundCase.client._id.toString() === userId;
  const isAssignedLawyer = isLawyer && 
    foundCase.lawyers.some(l => l._id.toString() === userId);

  if (!isClient && !isAssignedLawyer) {
    return { valid: false, status: 403, message: 'Unauthorized access to case' };
  }

  return { valid: true, case: foundCase };
};

export const createCase = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { 
      title,
      description,
      type,
      priority,
      court,
      clientId,
      lawyerIds,
      hearingDates,
      tags
    } = req.body;

    // Validate client exists and is a client
    const client = await User.findById(clientId);
    if (!client || client.role !== 'client') {
      return res.status(400).json({ message: 'Invalid client ID' });
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

    // Create new case
    const newCase = new Case({
      title,
      description,
      type,
      priority,
      court,
      client: clientId,
      lawyers: lawyerIds || [],
      hearings: hearingDates?.map((date: string) => ({ date: new Date(date), purpose: 'Initial hearing' })) || [],
      tags
    });

    await newCase.save();

    // Populate for response
    const populatedCase = await Case.findById(newCase._id)
      .populate('client', 'name email phone')
      .populate('lawyers', 'name email specialization');

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
      type,
      priority,
      search,
      clientId,
      lawyerId,
      fromDate,
      toDate
    } = req.query;

    let query: mongoose.FilterQuery<ICase> = {};
    const user = req.user;

    // Role-based filtering
    if (user?.role === 'client') {
      query.client = new mongoose.Types.ObjectId(user.id);
    } else if (user?.role === 'lawyer') {
      query.lawyers = new mongoose.Types.ObjectId(user.id);
    }

    // Additional filters with type validation
    if (status && ['open', 'closed', 'pending', 'dismissed', 'appealed'].includes(status as string)) {
      query.status = status;
    }

    if (type && ['civil', 'criminal', 'family', 'corporate', 'property', 'labor', 'other'].includes(type as string)) {
      query.type = type;
    }

    if (priority && ['low', 'medium', 'high', 'critical'].includes(priority as string)) {
      query.priority = priority;
    }

    // Client/lawyer specific filtering (for admin users)
    if (user?.role === 'admin') {
      if (clientId) {
        query.client = new mongoose.Types.ObjectId(clientId as string);
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

    // Search functionality with text index support
    if (search) {
      const searchStr = search as string;
      if (searchStr.length > 2) {
        query.$or = [
          { caseNumber: { $regex: searchStr, $options: 'i' } },
          { title: { $regex: searchStr, $options: 'i' } },
          { description: { $regex: searchStr, $options: 'i' } },
          { 'court.name': { $regex: searchStr, $options: 'i' } },
          { tags: { $in: [new RegExp(searchStr, 'i')] } }
        ];
      }
    }

    // Get cases with pagination
    const [cases, total] = await Promise.all([
      Case.find(query)
        .populate('client', 'name email phone')
        .populate('lawyers', 'name email specialization')
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
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;    
    const access = await validateCaseAccess(userId!, caseId, isLawyer);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    const foundCase = await Case.findById(caseId)
      .populate('client', 'name email phone')
      .populate('lawyers', 'name email specialization')
      .populate('documents', 'name fileUrl createdAt')
      .populate('relatedCases', 'caseNumber title status');

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
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const access = await validateCaseAccess(userId!, caseId, isLawyer);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    // Lawyers can only update certain fields
    const updateData = isLawyer
      ? {
          status: req.body.status,
          hearings: req.body.hearings,
          outcome: req.body.outcome
        }
      : req.body;

    // If updating lawyers, validate they exist and are lawyers
    if (req.body.lawyerIds) {
      const lawyers = await User.find({ 
        _id: { $in: req.body.lawyerIds }, 
        role: 'lawyer' 
      });
      if (lawyers.length !== req.body.lawyerIds.length) {
        return res.status(400).json({ message: 'One or more invalid lawyer IDs' });
      }
      updateData.lawyers = req.body.lawyerIds;
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('client', 'name email phone')
      .populate('lawyers', 'name email specialization');

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

export const addHearing = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caseId = req.params.id;
    const userId = req.user?.id;
    const { date, purpose, notes } = req.body;
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    if (!date || !purpose) {
      return res.status(400).json({ message: 'Date and purpose are required' });
    }

    const access = await validateCaseAccess(userId!, caseId, true);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    const updatedCase = await Case.findByIdAndUpdate(
      caseId,
      { $push: { hearings: { date: new Date(date), purpose, notes } } },
      { new: true }
    );

    logger.info(`Hearing added to case ${updatedCase?.caseNumber} by user ${userId}`);
    res.status(200).json({
      success: true,
      data: updatedCase
    });
  } catch (error: any) {
    logger.error(`Add hearing error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to add hearing',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const searchCases = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { query } = req.query;
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const searchRegex = new RegExp(query as string, 'i');

    let baseQuery: mongoose.FilterQuery<ICase> = {
      $or: [
        { caseNumber: searchRegex },
        { title: searchRegex },
        { description: searchRegex },
        { 'court.name': searchRegex },
        { tags: { $in: [new RegExp(query as string, 'i')] } }
      ]
    };

    // Apply role-based filtering
    if (req.user?.role === 'client') {
      baseQuery.client = new mongoose.Types.ObjectId(userId!);
    } else if (req.user?.role === 'lawyer') {
      baseQuery.lawyers = new mongoose.Types.ObjectId(userId!);
    }

    const cases = await Case.find(baseQuery)
      .select('caseNumber title status priority nextHearing')
      .limit(10)
      .lean();

    res.status(200).json({
      success: true,
      count: cases.length,
      data: cases
    });
  } catch (error: any) {
    logger.error(`Case search error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to search cases',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const getCaseTimeline = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const caseId = req.params.id;
    const userId = req.user?.id;
    const isLawyer = req.user?.role === 'lawyer';
    const page = Math.max(1, parseInt(req.query.page as string) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit as string) || 10));
    const skip = (page - 1) * limit;
    const access = await validateCaseAccess(userId!, caseId, isLawyer);
    if (!access.valid) {
        return res.status(access.status ?? 500).json({ message: access.message });
    }

    const foundCase = await Case.findById(caseId)
      .select('hearings createdAt updatedAt status')
      .sort({ 'hearings.date': 1 });

    if (!foundCase) {
      return res.status(404).json({ message: 'Case not found' });
    }

    const timeline = [
      {
        type: 'case_created',
        date: foundCase.createdAt,
        description: 'Case was opened'
      },
      ...foundCase.hearings.map(hearing => ({
        type: 'hearing',
        date: hearing.date,
        description: hearing.purpose,
        details: hearing
      })),
      {
        type: 'status_update',
        date: foundCase.updatedAt,
        description: `Case status changed to ${foundCase.status}`
      }
    ].sort((a, b) => b.date.getTime() - a.date.getTime());

    res.status(200).json({
      success: true,
      data: timeline
    });
  } catch (error: any) {
    logger.error(`Get case timeline error: ${error.message}`);
    res.status(500).json({ 
      success: false,
      message: 'Failed to get case timeline',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};