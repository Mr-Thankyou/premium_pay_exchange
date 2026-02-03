import mongoose, { Document, Model } from "mongoose";

export interface IStats extends Document {
  tradersOnline: number;
  totalRegistered: number;
  dealsToday: number;
  updatedAt: Date;
}

const StatsSchema = new mongoose.Schema<IStats>(
  {
    tradersOnline: { type: Number, default: 0 },
    totalRegistered: { type: Number, default: 0 },
    dealsToday: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Stats =
  (mongoose.models.Stats as Model<IStats>) ||
  mongoose.model<IStats>("Stats", StatsSchema);

export default Stats;
