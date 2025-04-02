import { Schema, model, Document, Types } from 'mongoose';
import logger from '../utils/logger';

// Interface for Stakeholder subdocument
interface IStakeholder {
  name: string;
  email?: string;
  phone?: string;
  relation?: string;
}

// Interface for Counsel subdocument
interface ICounsel {
  name: string;
  email?: string;
  phone?: string;
  firm?: string;
}

// Interface for Defendant subdocument
interface IDefendant {
  name: string;
  email?: string;
  phone?: string;
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
  caseType: 'civil' | 'criminal' | 'family' | 'commercial' | 'writs';
  status: 'active' | 'closed';
  courtType: 'supreme' | 'high' | 'district' | 'commercial' | 'family';
  courtHall?: string;
  judge?: string;
  hearings: IHearing[];
  petitioner: Types.ObjectId;
  defendant: IDefendant;
  lawyers: Types.ObjectId[];
  seniorCounsel: boolean;
  stakeholders: IStakeholder[];
  counselForRespondent: ICounsel[];
  documents: Types.ObjectId[];
  relatedCases: Types.ObjectId[];
  nextHearing?: Date;
  closingDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const HearingSchema = new Schema<IHearing>({
  date: { type: Date, required: true },
  purpose: { type: String, required: true },
  outcome: { type: String },
  notes: { type: String },
}, { _id: false });

const StakeholderSchema = new Schema<IStakeholder>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  relation: { type: String },
}, { _id: false });

const CounselSchema = new Schema<ICounsel>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
  firm: { type: String },
}, { _id: false });

const DefendantSchema = new Schema<IDefendant>({
  name: { type: String, required: true },
  email: { type: String },
  phone: { type: String },
}, { _id: false });

const CaseSchema = new Schema<ICase>(
  {
    caseNumber: { 
      type: String, 
      required: true, 
      unique: true
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
    caseType: { 
      type: String, 
      required: true,
      enum: ['civil', 'criminal', 'family', 'commercial', 'writs'],
      default: 'civil'
    },
    status: { 
      type: String, 
      enum: ['active', 'closed'], 
      default: 'active' 
    },
    courtType: {
      type: String,
      required: true,
      enum: ['supreme', 'high', 'district', 'commercial', 'family']
    },
    courtHall: {
      type: String
    },
    judge: {
      type: String
    },
    hearings: [HearingSchema],
    petitioner: { 
      type: Schema.Types.ObjectId, 
      ref: 'User', 
      required: true 
    },
    defendant: {
      type: DefendantSchema,
      required: true
    },
    lawyers: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'User' 
    }],
    seniorCounsel: {
      type: Boolean,
      default: false
    },
    stakeholders: [StakeholderSchema],
    counselForRespondent: [CounselSchema],
    documents: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Document' 
    }],
    relatedCases: [{ 
      type: Schema.Types.ObjectId, 
      ref: 'Case' 
    }],
    nextHearing: {
      type: Date
    },
    closingDate: {
      type: Date,
      validate: {
        validator: function(this: ICase, value: Date) {
          if (this.status === 'closed' && !value) {
            return false;
          }
          if (value && value > new Date('2025-03-29')) {
            return false;
          }
          return true;
        },
        message: 'Closed cases must have a closing date before March 29, 2025'
      }
    }
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for better query performance
CaseSchema.index({ caseNumber: 1 });
CaseSchema.index({ status: 1 });
CaseSchema.index({ petitioner: 1 });
CaseSchema.index({ 'defendant.name': 1 });
CaseSchema.index({ nextHearing: 1 });
CaseSchema.index({ caseType: 1 });
CaseSchema.index({ courtType: 1 });

// Virtual for active cases
CaseSchema.virtual('isActive').get(function() {
  return this.status === 'active';
});

// Pre-save hook to generate case number
CaseSchema.pre('save', async function(next) {
  if (this.isNew) {
    try {
      const count = await this.model('Case').countDocuments();
      const year = new Date().getFullYear().toString().slice(-2);
      this.caseNumber = `CS-${year}-${(count + 1).toString().padStart(4, '0')}`;
      next();
    } catch (error: any) {
      logger.error(`Error generating case number: ${error.message}`);
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

// Pre-update hook to validate closing date
CaseSchema.pre('findOneAndUpdate', async function(next) {
  const update = this.getUpdate() as any;
  if (update?.status === 'closed' && !update?.closingDate) {
    const error = new Error('Closing date is required when closing a case');
    logger.error(error.message);
    next(error);
  } else {
    next();
  }
});

const Case = model<ICase>('Case', CaseSchema);
export default Case;