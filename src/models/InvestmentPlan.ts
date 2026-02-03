// models/InvestmentPlan.ts
import mongoose, { Schema, Document, models } from "mongoose";

export interface IInvestmentPlan extends Document {
  name: string;
  price?: number; // optional fixed price example
  durationDays: number;
  profitPercentDaily: number; // e.g. 1.5 for 1.5% daily (use whichever convention you prefer)
  minDeposit: number;
  maxDeposit: number;
  createdAt: Date;
}

const InvestmentPlanSchema = new Schema<IInvestmentPlan>({
  name: { type: String, required: true },
  price: { type: Number }, // optional fixed plan price
  durationDays: { type: Number, required: true },
  profitPercentDaily: { type: Number, required: true },
  minDeposit: { type: Number, required: true },
  maxDeposit: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now },
});

const InvestmentPlan =
  models.InvestmentPlan ||
  mongoose.model<IInvestmentPlan>("InvestmentPlan", InvestmentPlanSchema);
export default InvestmentPlan;
