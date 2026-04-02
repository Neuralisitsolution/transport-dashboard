import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IJob extends Document {
  title: string;
  slug: string;
  organization: string;
  department: string;
  category: 'Central Govt' | 'Banking' | 'State Govt' | 'Defence' | 'Teaching';
  subCategory: string;
  totalVacancies: number;
  eligibility: {
    age: { min: number; max: number };
    ageRelaxation: string;
    education: string;
    experience: string;
  };
  importantDates: {
    notificationDate: string;
    applicationStart: string;
    applicationEnd: string;
    examDate: string;
    admitCardDate: string;
    resultDate: string;
  };
  applicationFee: {
    general: number;
    obc: number;
    scSt: number;
    female: number;
    exServiceman: number;
  };
  salary: {
    payScale: string;
    minSalary: number;
    maxSalary: number;
    inHandEstimate: number;
  };
  location: string;
  applyOnlineLink: string;
  officialNotificationLink: string;
  officialWebsite: string;
  examPattern: string;
  selectionProcess: string;
  statesAccepted: string[];
  isActive: boolean;
  isFeatured: boolean;
  views: number;
  createdAt: Date;
  updatedAt: Date;
}

const JobSchema = new Schema<IJob>(
  {
    title: { type: String, required: true, index: true },
    slug: { type: String, required: true, unique: true, index: true },
    organization: { type: String, required: true },
    department: { type: String, default: '' },
    category: {
      type: String,
      required: true,
      enum: ['Central Govt', 'Banking', 'State Govt', 'Defence', 'Teaching'],
      index: true,
    },
    subCategory: { type: String, default: '' },
    totalVacancies: { type: Number, default: 0 },
    eligibility: {
      age: { min: { type: Number, default: 18 }, max: { type: Number, default: 65 } },
      ageRelaxation: { type: String, default: '' },
      education: { type: String, default: '' },
      experience: { type: String, default: '' },
    },
    importantDates: {
      notificationDate: { type: String, default: '' },
      applicationStart: { type: String, default: '' },
      applicationEnd: { type: String, default: '' },
      examDate: { type: String, default: '' },
      admitCardDate: { type: String, default: '' },
      resultDate: { type: String, default: '' },
    },
    applicationFee: {
      general: { type: Number, default: 0 },
      obc: { type: Number, default: 0 },
      scSt: { type: Number, default: 0 },
      female: { type: Number, default: 0 },
      exServiceman: { type: Number, default: 0 },
    },
    salary: {
      payScale: { type: String, default: '' },
      minSalary: { type: Number, default: 0 },
      maxSalary: { type: Number, default: 0 },
      inHandEstimate: { type: Number, default: 0 },
    },
    location: { type: String, default: 'All India' },
    applyOnlineLink: { type: String, default: '' },
    officialNotificationLink: { type: String, default: '' },
    officialWebsite: { type: String, default: '' },
    examPattern: { type: String, default: '' },
    selectionProcess: { type: String, default: '' },
    statesAccepted: [{ type: String }],
    isActive: { type: Boolean, default: true, index: true },
    isFeatured: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

JobSchema.index({ category: 1, isActive: 1 });
JobSchema.index({ 'importantDates.applicationEnd': 1 });
JobSchema.index({ createdAt: -1 });

export default (mongoose.models.Job as Model<IJob>) || mongoose.model<IJob>('Job', JobSchema);
