import { body } from 'express-validator';
import { RequestHandler } from 'express';

export const createCaseValidation: RequestHandler[] = [
  body('title').notEmpty().withMessage('Title is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').isIn(['civil', 'criminal', 'family', 'corporate', 'property', 'labor', 'other'])
    .withMessage('Invalid case type'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('court.name').notEmpty().withMessage('Court name is required'),
  body('court.location').notEmpty().withMessage('Court location is required'),
  body('clientId').notEmpty().withMessage('Client ID is required'),
  body('lawyerIds').optional().isArray().withMessage('Lawyer IDs must be an array'),
  body('hearingDates').optional().isArray().withMessage('Hearing dates must be an array'),
  body('tags').optional().isArray().withMessage('Tags must be an array')
];

export const updateCaseValidation: RequestHandler[] = [
  body('title').optional().notEmpty().withMessage('Title cannot be empty'),
  body('description').optional().notEmpty().withMessage('Description cannot be empty'),
  body('status').optional().isIn(['open', 'closed', 'pending', 'dismissed', 'appealed'])
    .withMessage('Invalid status'),
  body('priority').optional().isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('Invalid priority level'),
  body('lawyerIds').optional().isArray().withMessage('Lawyer IDs must be an array'),
  body('outcome').optional().isString().withMessage('Outcome must be a string')
];

export const addHearingValidation: RequestHandler[] = [
  body('date').isISO8601().withMessage('Valid hearing date is required'),
  body('purpose').notEmpty().withMessage('Hearing purpose is required')
];