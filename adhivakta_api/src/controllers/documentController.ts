import { Request, Response } from 'express';
import multer from 'multer';
import DocumentModel from '../models/Document';
import Case from '../models/Case';
import { uploadFile, deleteFile } from '../utils/storage';
import logger from '../utils/logger';
import admin from '../config/firebase';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

const bucket = admin.storage().bucket();

const upload = multer({ storage: multer.memoryStorage() }).single('file');

export const uploadDocument = async (req: AuthenticatedRequest, res: Response) => {
  upload(req, res, async (err) => {
    try {
      if (err) throw new Error(err.message);
      if (!req.file) throw new Error('No file uploaded');

      const { caseId, name, description } = req.body;
      const userId = req.user?.id;

      // Validate case access
      const foundCase = await Case.findById(caseId)
        .populate('petitioner', 'id')
        .populate('lawyers', 'id');
      
      if (!foundCase) throw new Error('Case not found');

      const hasAccess = 
        foundCase.petitioner._id.toString() === userId ||
        foundCase.lawyers.some((l: any) => l._id.toString() === userId);
      
      if (!hasAccess) throw new Error('Unauthorized access');

      // Upload to Firebase
      const { url, fileName } = await uploadFile(req.file, `cases/${caseId}`);

      // Save document metadata
      const newDoc = new DocumentModel({
        name,
        description,
        fileUrl: url,
        fileType: req.file.mimetype,
        fileSize: req.file.size,
        case: caseId,
        uploadedBy: userId,
        access: [userId, foundCase.petitioner._id, ...foundCase.lawyers.map((l: any) => l._id)],
      });

      await newDoc.save();

      // Update case with document reference
      await Case.findByIdAndUpdate(caseId, { $push: { documents: newDoc._id } });

      res.status(201).json({
        success: true,
        data: newDoc,
      });
    } catch (error: any) {
      logger.error(`Document upload failed: ${error.message}`);
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  });
};

export const getCaseDocuments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { caseId } = req.params;
    const userId = req.user?.id;

    // First verify the user has access to the case
    const foundCase = await Case.findOne({
      _id: caseId,
      $or: [
        { petitioner: userId },
        { lawyers: userId }
      ]
    });

    if (!foundCase) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to case documents'
      });
    }

    const docs = await DocumentModel.find({
      case: caseId,
      access: userId,
    }).populate('uploadedBy', 'name email');

    res.status(200).json({
      success: true,
      data: docs,
    });
  } catch (error: any) {
    logger.error(`Failed to fetch documents: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const document = await DocumentModel.findById(id);
    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found'
      });
    }

    // Verify user has access to delete (either petitioner or lawyer)
    const foundCase = await Case.findOne({
      _id: document.case,
      $or: [
        { petitioner: userId },
        { lawyers: userId }
      ]
    });

    if (!foundCase) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this document'
      });
    }

    // Delete from storage
    await deleteFile(document.fileUrl);

    // Delete from database
    await DocumentModel.findByIdAndDelete(id);

    // Remove reference from case
    await Case.findByIdAndUpdate(document.case, {
      $pull: { documents: id }
    });

    res.status(200).json({
      success: true,
      message: 'Document deleted successfully'
    });
  } catch (error: any) {
    logger.error(`Failed to delete document: ${error.message}`);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};