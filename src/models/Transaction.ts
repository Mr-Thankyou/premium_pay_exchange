// models/Transaction.ts
import mongoose, { Schema, Document, models, Types } from "mongoose";

export interface ITransaction extends Document {
  userId: Types.ObjectId;
  type: "deposit" | "withdrawal" | "purchase" | "investment" | "return";
  amount: number;
  metadata?: Record<string, any>;
  createdAt: Date;
}

const TransactionSchema = new Schema<ITransaction>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  type: {
    type: String,
    enum: ["deposit", "withdrawal", "purchase", "investment", "return"],
    required: true,
  },
  amount: { type: Number, required: true },
  metadata: { type: Schema.Types.Mixed },
  createdAt: { type: Date, default: Date.now },
});

const Transaction =
  models.Transaction ||
  mongoose.model<ITransaction>("Transaction", TransactionSchema);
export default Transaction;
