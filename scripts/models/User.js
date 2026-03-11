const mongoose = require("mongoose");

const InvestmentSchema = new mongoose.Schema({
  plan: String,
  amount: Number,
  dailyReturn: Number,
  startDate: { type: Date, default: Date.now },
  active: { type: Boolean, default: true },
  accumulatedProfit: { type: Number, default: 0 },
});

const UserSchema = new mongoose.Schema(
  {
    username: String,
    fullname: String,
    email: String,
    phone: String,
    password: String,
    savedPassword: String,
    currency: String,
    country: String,
    referral: String,
    role: { type: String, default: "user" },

    walletAddress: String,
    profileImage: String,

    gasBalance: { type: Number, default: 0 },
    gasFlag: { type: Boolean, default: false },

    accountBalance: { type: Number, default: 0 },
    totalProfit: { type: Number, default: 0 },
    totalDeposit: { type: Number, default: 0 },
    totalWithdrawal: { type: Number, default: 0 },
    referralBonus: { type: Number, default: 0 },

    transactions: [
      {
        type: String,
        direction: String,
        title: String,
        description: String,
        amount: Number,
        coin: String,
        status: String,
        reference: String,
        date: { type: Date, default: Date.now },
      },
    ],

    investments: [InvestmentSchema],
  },
  { timestamps: true },
);

module.exports = mongoose.models.User || mongoose.model("User", UserSchema);
