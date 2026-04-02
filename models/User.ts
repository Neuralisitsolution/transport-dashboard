import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  email: string;
  name: string;
  age: number;
  dob: string;
  education: string;
  category: string;
  state: string;
  preferredCategories: string[];
  preferredStates: string[];
  minSalary: number;
  savedJobs: string[];
  appliedJobs: string[];
  notificationPreferences: {
    email: boolean;
    telegram: boolean;
    dailyDigest: boolean;
    instantAlerts: boolean;
  };
  telegramChatId: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, required: true, unique: true, index: true },
    name: { type: String, required: true },
    age: { type: Number, default: 0 },
    dob: { type: String, default: '' },
    education: { type: String, default: '' },
    category: { type: String, default: 'General' },
    state: { type: String, default: '' },
    preferredCategories: [{ type: String }],
    preferredStates: [{ type: String }],
    minSalary: { type: Number, default: 0 },
    savedJobs: [{ type: String }],
    appliedJobs: [{ type: String }],
    notificationPreferences: {
      email: { type: Boolean, default: true },
      telegram: { type: Boolean, default: false },
      dailyDigest: { type: Boolean, default: true },
      instantAlerts: { type: Boolean, default: true },
    },
    telegramChatId: { type: String, default: '' },
  },
  { timestamps: true }
);

export default (mongoose.models.User as Model<IUser>) || mongoose.model<IUser>('User', UserSchema);
