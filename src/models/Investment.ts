import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface IInvestment extends Document {
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  amount: number;
  startDate: Date;
  status: "active" | "completed" | "cancelled";
  createdAt: Date;
  endedAt?: Date; // when completed
}

const InvestmentSchema = new Schema<IInvestment>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  planId: {
    type: Schema.Types.ObjectId,
    ref: "InvestmentPlan",
    required: true,
  },
  amount: { type: Number, required: true },
  startDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["active", "completed", "cancelled"],
    default: "active",
  },
  endedAt: { type: Date },
  createdAt: { type: Date, default: Date.now },
});

const Investment =
  models.Investment ||
  mongoose.model<IInvestment>("Investment", InvestmentSchema);
export default Investment;
