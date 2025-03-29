import { Schema, model, Document, Types } from 'mongoose';

export interface IDocument extends Document {
  name: string;
  description?: string;
  fileUrl: string;
  fileType: string;
  fileSize: number;
  case: Types.ObjectId;
  uploadedBy: Types.ObjectId;
  access: Types.ObjectId[]; // Users who can access
  createdAt: Date;
}

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    fileSize: { type: Number, required: true },
    case: { type: Schema.Types.ObjectId, ref: 'Case', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    access: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  { timestamps: true }
);

const DocumentModel = model<IDocument>('Document', DocumentSchema);
export default DocumentModel;