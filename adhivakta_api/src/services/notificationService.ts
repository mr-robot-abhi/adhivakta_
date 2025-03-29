import { Notification, NotificationType } from '../models/Notification';
import admin from 'firebase-admin';
import { sendEmail } from './emailService';

interface CreateNotificationParams {
  userId: string;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: {
    type: 'Case' | 'Document' | 'Hearing';
    id: string;
  };
}

export const createNotification = async (params: CreateNotificationParams) => {
  try {
    // Save to database
    const notification = new Notification({
      userId: params.userId,
      type: params.type,
      title: params.title,
      message: params.message,
      relatedEntity: params.relatedEntity,
    });

    await notification.save();

    // Send push notification if user has FCM token
    await sendPushNotification(params.userId, params.title, params.message);

    // Send email notification
    await sendEmail({
      to: 'user@example.com', // Replace with actual user email
      subject: params.title,
      text: params.message,
    });

    return notification;
  } catch (error) {
    console.error('Notification creation failed:', error);
  }
};

const sendPushNotification = async (userId: string, title: string, body: string) => {
  // In a real app, you'd fetch the user's FCM token from the database
  const fcmToken = 'USER_FCM_TOKEN'; 
  
  if (fcmToken) {
    await admin.messaging().send({
      token: fcmToken,
      notification: { title, body },
    });
  }
};