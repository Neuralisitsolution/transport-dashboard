import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IEmailSubscriber extends Document {
  email: string;
  categories: string[];
  states: string[];
  isActive: boolean;
  subscribedAt: Date;
}

const EmailSubscriberSchema = new Schema<IEmailSubscriber>({
  email: { type: String, required: true, unique: true, index: true },
  categories: [{ type: String }],
  states: [{ type: String }],
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
});

export default (mongoose.models.EmailSubscriber as Model<IEmailSubscriber>) ||
  mongoose.model<IEmailSubscriber>('EmailSubscriber', EmailSubscriberSchema);
