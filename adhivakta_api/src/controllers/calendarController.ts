import { Request, Response } from 'express';
import CaseModel from '../models/Case'; // Changed from Case to CaseModel
import logger from '../utils/logger';

// Add this interface at the top
interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getCalendarEvents = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { start, end } = req.query;

    const cases = await CaseModel.find({
      $or: [
        { client: userId },
        { lawyers: userId }
      ],
      hearings: {
        $elemMatch: {
          date: { 
            $gte: new Date(start as string),
            $lte: new Date(end as string) 
          }
        }
      }
    });

    // Add proper typing for the mapping functions
    const events = cases.flatMap((c: any) => 
      c.hearings.map((h: any) => ({
        id: h._id,
        title: `Hearing: ${c.title}`,
        start: h.date,
        end: new Date(h.date.getTime() + 60 * 60 * 1000),
        caseId: c._id,
        court: c.court.name,
        purpose: h.purpose
      }))
    );

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error: any) {
    logger.error(`Failed to fetch calendar events: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch calendar events',
    });
  }
};