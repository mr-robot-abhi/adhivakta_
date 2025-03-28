import mongoose, { Schema, type Document } from "mongoose"

export interface IDocument extends Document {
  name: string
  type: string
  size: number
  url: string
  case?: mongoose.Types.ObjectId
  uploadedBy: mongoose.Types.ObjectId
  tags?: string[]
  description?: string
  createdAt: Date
  updatedAt: Date
}

const DocumentSchema = new Schema<IDocument>(
  {
    name: { type: String, required: true },
    type: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    case: { type: Schema.Types.ObjectId, ref: "Case" },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    tags: [{ type: String }],
    description: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Document || mongoose.model<IDocument>("Document", DocumentSchema)

