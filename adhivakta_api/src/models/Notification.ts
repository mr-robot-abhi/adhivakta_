import { Schema, model, Document, Types } from 'mongoose';

export enum NotificationType {
  CASE_UPDATE = 'case_update',
  HEARING_REMINDER = 'hearing_reminder',
  DOCUMENT_UPLOAD = 'document_upload',
  GENERAL = 'general'
}

export interface INotification extends Document {
  userId: Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  relatedEntity?: {
    type: 'Case' | 'Document' | 'Hearing';
    id: Types.ObjectId;
  };
  read: boolean;
  createdAt: Date;
}

const NotificationSchema = new Schema<INotification>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: Object.values(NotificationType), 
    required: true 
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedEntity: {
    type: {
      type: String,
      enum: ['Case', 'Document', 'Hearing']
    },
    id: { type: Schema.Types.ObjectId }
  },
  read: { type: Boolean, default: false },
}, { timestamps: true });

export const Notification = model<INotification>('Notification', NotificationSchema);