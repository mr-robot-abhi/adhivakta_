import { Schema, model, Document, Types } from 'mongoose';
import logger from '../utils/logger';

// Interface for Court subdocument
interface ICourt {
  name: string;
  location: string;
  judge?: string;
  additionalInfo?: string;
}

// Interface for Hearing subdocument
interface IHearing {
  date: Date;
  purpose: string;
  outcome?: string;
  notes?: string;
}

// Main Case interface
export interface ICase extends Document {
  caseNumber: string;
  title: string;
  description: string;
  type: string;
  status: 'open' | 'closed' | 'pending' | 'dismissed' | 'appealed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  hearings: IHearing[];
  court: ICourt;
  client: Types.ObjectId;
  lawyers: Types.ObjectId[];
  documents: Types.ObjectId[];
  relatedCases: Types.ObjectId[];
  outcome?: string;
  billingInfo?: {
    hourlyRate?: number;
    fixedFee?: number;
    expenses?: number;
    totalBilled?: number;
  };
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const HearingSchema = new Schema<IHearing>({
  date: { type: Date, required: true },
  purpose: { type: String, required: true },
  outcome: { type: String },
  notes: { type: String },
}, { _id: false });

const CourtSchema = new Schema<ICourt>({
  name: { type: String, required: true },
  location: { type: String, required: true },
  judge: { type: String },
  additionalInfo: { type: String },
}, { _id: false });

const BillingInfoSchema = new Schema({
  hourlyRate: { type: Number },
  fixedFee: { type: Number },
  expenses: { type: Number, default: 0 },
  totalBilled: { type: Number, default: 0 },
}, { _id: false });

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: { 
      type: String, 
      required: true, 
      unique: true,
      index: true 
    },
    title: { 
      type: String, 
      required: true,
      trim: true 
    },
    description: { 
      type: String, 
      required: true,
      trim: true 
    },
    type: { 
      type: String, 
      required: true,
      enum: ['civil', 'criminal', 'family', 'corporate', 'property', 'labor', 'other'],
      default: 'other'
    },
    status: { 
      type: String, 
      enum: ['open', 'closed', 'pending', 'dismissed', 'appealed'], 
      default: 'open' 
    },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    hearings: [HearingSchema],
    court: { 
      type: CourtSchema, 
      required: true 
    },
    client: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    lawyers: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    documents: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Document' 
    }],
    relatedCases: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Case' 
    }],
    outcome: { 
      type: String 
    },
    billingInfo: {
      type: BillingInfoSchema
    },
    tags: [{ 
      type: String,
      trim: true 
    }]
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Virtual for next hearing
CaseSchema.virtual('nextHearing').get(function() {
  const now = new Date();
  const upcomingHearings = this.hearings
    .filter(h => h.date > now)
    .sort((a, b) => a.date.getTime() - b.date.getTime());
  return upcomingHearings.length > 0 ? upcomingHearings[0] : null;
});

// Pre-save hook to generate case number
CaseSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const count = await this.model('Case').countDocuments();
      const year = new Date().getFullYear().toString().slice(-2);
      this.caseNumber = `CASE-${year}-${(count + 1).toString().padStart(4, '0')}`;
      next();
    } catch (error: any) {
      next(error);
    }
  } else {
    next();
  }
});

// Post-save hook for logging
CaseSchema.post('save', function(doc) {
  logger.info(`Case ${doc.caseNumber} (${doc._id}) was saved`);
});

const Case = model<ICase>('Case', CaseSchema);
export default Case;