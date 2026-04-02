import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITelegramSubscriber extends Document {
  chatId: string;
  username: string;
  categories: string[];
  states: string[];
  isActive: boolean;
  subscribedAt: Date;
}

const TelegramSubscriberSchema = new Schema<ITelegramSubscriber>({
  chatId: { type: String, required: true, unique: true, index: true },
  username: { type: String, default: '' },
  categories: [{ type: String }],
  states: [{ type: String }],
  isActive: { type: Boolean, default: true },
  subscribedAt: { type: Date, default: Date.now },
});

export default (mongoose.models.TelegramSubscriber as Model<ITelegramSubscriber>) ||
  mongoose.model<ITelegramSubscriber>('TelegramSubscriber', TelegramSubscriberSchema);
