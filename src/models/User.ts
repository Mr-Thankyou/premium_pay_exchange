import mongoose, { Schema, Document, models } from "mongoose";

export interface IInvestment {
  plan: "beginner" | "standard" | "business";
  amount: number;
  dailyReturn: number; // %
  startDate: Date;
  active: boolean;
  accumulatedProfit: number;
}

export interface IUser extends Document {
  username: string;
  fullname: string;
  email: string;
  phone: string;
  password: string;
  savedPassword: string;
  currency: string;
  country: string;
  referral?: string;
  role: string;
  walletAddress: string;
  profileImage?: string;
  resetToken?: string;
  resetTokenExpire?: number;
  createdAt: Date;

  // BALANCES
  accountBalance: number;
  totalProfit: number;
  totalDeposit: number;
  totalWithdrawal: number;
  referralBonus: number;

  // WALLET TRANSACTIONS
  deposits: {
    coin: string;
    amount: number;
    screenshot?: string;
    depositAddress?: string;
    status: "pending" | "approved" | "rejected";
    date: Date;
  }[];

  withdrawals: {
    coin: string;
    amount: number;
    address: string;
    status: "pending" | "approved" | "rejected";
    date: Date;
  }[];

  // History
  transactions: {
    type:
      | "deposit"
      | "withdrawal"
      | "transfer"
      | "investment"
      | "profit"
      | "referral_bonus";
    direction?: "in" | "out"; // for transfer type
    title: string; // Short label
    description: string; // Fully customizable message
    amount: number;
    coin: string;
    status: "pending" | "approved" | "rejected";
    reference?: string; // PPE_xxxxx
    date: Date;
  }[];

  // INVESTMENTS
  investments: IInvestment[];
}

const UserSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    fullname: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    password: { type: String, required: true },
    savedPassword: { type: String, required: true, default: "" },
    currency: { type: String, required: true },
    country: { type: String, required: true },
    referral: { type: String },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    resetToken: { type: String },
    resetTokenExpire: { type: Number },
    createdAt: { type: Date, default: Date.now },

    // Wallet Address
    walletAddress: {
      type: String,
      required: true,
      unique: true,
    },

    profileImage: {
      type: String,
      default: "",
    },

    // Balances
    accountBalance: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    totalWithdrawal: { type: Number, default: 0 },
    referralBonus: { type: Number, default: 0 },

    // Deposit records
    deposits: {
      type: [
        {
          coin: String,
          amount: Number,
          screenshot: String,
          depositAddress: String,
          status: { type: String, default: "pending" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    withdrawals: {
      type: [
        {
          coin: String,
          amount: Number,
          address: String,
          status: { type: String, default: "pending" },
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    // History
    transactions: {
      type: [
        {
          type: { type: String, required: true },
          direction: {
            type: String,
            enum: ["in", "out"],
          },
          title: { type: String, required: true },
          description: { type: String, required: true },
          amount: { type: Number, required: true },
          coin: { type: String, required: true },
          status: { type: String, default: "pending" },
          reference: String,
          date: { type: Date, default: Date.now },
        },
      ],
      default: [],
    },

    investments: {
      type: [
        {
          plan: { type: String, required: true },
          amount: { type: Number, required: true },
          dailyReturn: { type: Number, required: true },
          startDate: { type: Date, default: Date.now },
          active: { type: Boolean, default: true },
          accumulatedProfit: { type: Number, default: 0 },
        },
      ],
      default: [],
    },
  },
  { timestamps: true },
);

// export default mongoose.models.User || mongoose.model("User", UserSchema);
const User = models.User || mongoose.model<IUser>("User", UserSchema);

export default User;
