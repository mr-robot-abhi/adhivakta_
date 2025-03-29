import { Request, Response } from 'express';
import { Notification } from '../models/Notification';
import logger from '../utils/logger';

interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    role: string;
  };
}

export const getUserNotifications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    const { limit = 20, page = 1 } = req.query;

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 })
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      data: notifications,
    });
  } catch (error: any) {
    logger.error(`Failed to fetch notifications: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch notifications',
    });
  }
};

export const markAsRead = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    const notification = await Notification.findOneAndUpdate(
      { _id: id, userId },
      { read: true },
      { new: true }
    );

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notification not found',
      });
    }

    res.status(200).json({
      success: true,
      data: notification,
    });
  } catch (error: any) {
    logger.error(`Failed to mark notification as read: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to update notification',
    });
  }
};