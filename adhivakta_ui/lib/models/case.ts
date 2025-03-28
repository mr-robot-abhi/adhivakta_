import mongoose, { Schema, type Document } from "mongoose"

export interface ICase extends Document {
  caseNumber: string
  title: string
  court: string
  status: "active" | "pending" | "closed"
  filingDate: Date
  nextHearing?: Date
  description: string
  client: mongoose.Types.ObjectId
  assignedLawyers: mongoose.Types.ObjectId[]
  opposingParty?: string
  opposingCounsel?: string
  documents: mongoose.Types.ObjectId[]
  createdAt: Date
  updatedAt: Date
}

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    court: { type: String, required: true },
    status: { type: String, enum: ["active", "pending", "closed"], default: "active" },
    filingDate: { type: Date, required: true },
    nextHearing: { type: Date },
    description: { type: String, required: true },
    client: { type: Schema.Types.ObjectId, ref: "User", required: true },
    assignedLawyers: [{ type: Schema.Types.ObjectId, ref: "User" }],
    opposingParty: { type: String },
    opposingCounsel: { type: String },
    documents: [{ type: Schema.Types.ObjectId, ref: "Document" }],
  },
  { timestamps: true },
)

export default mongoose.models.Case || mongoose.model<ICase>("Case", CaseSchema)

