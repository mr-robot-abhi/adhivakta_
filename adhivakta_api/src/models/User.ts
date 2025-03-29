import { Schema, model, Document } from 'mongoose';
import logger from '../utils/logger';

export interface IUser extends Document {
  uid: string;
  email: string;
  name: string;
  role: 'client' | 'associate' | 'lawyer';
  phone?: string;
  specialization?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    uid: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    role: {
      type: String,
      enum: ['client', 'associate', 'lawyer'],
      default: 'client', // Added default
      required: true
    },
    phone: { type: String },
    specialization: { type: String },
  },
  { timestamps: true }
);

// Middleware to log user creation
UserSchema.post('save', function (doc) {
  logger.info(`User created/updated: ${doc.email}`);
});

const User = model<IUser>('User', UserSchema);
export default User;