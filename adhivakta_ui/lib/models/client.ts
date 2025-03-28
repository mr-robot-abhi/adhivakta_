import mongoose, { Schema, type Document } from "mongoose"

export interface IClient extends Document {
  user: mongoose.Types.ObjectId
  type: "individual" | "corporate" | "family"
  contactPerson?: string
  company?: string
  cases: mongoose.Types.ObjectId[]
  notes?: string
  createdAt: Date
  updatedAt: Date
}

const ClientSchema = new Schema<IClient>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    type: { type: String, enum: ["individual", "corporate", "family"], required: true },
    contactPerson: { type: String },
    company: { type: String },
    cases: [{ type: Schema.Types.ObjectId, ref: "Case" }],
    notes: { type: String },
  },
  { timestamps: true },
)

export default mongoose.models.Client || mongoose.model<IClient>("Client", ClientSchema)

