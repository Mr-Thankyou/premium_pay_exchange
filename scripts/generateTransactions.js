const mongoose = require("mongoose");

// --- CONFIGURATION ---
// Go to Mongodb, find the particular user you want to update their transactions,
const MONGODB_URI =
  "mongodb+srv://premium_pay_exchange:ajexUbcmag1sbWej@cluster0.r2zbijg.mongodb.net/?appName=Cluster0";
const USER_ID = "69ad681a2c6524fb751cccb7";

// Define the Schema (Simplified to match your provided TypeScript)
const UserSchema = new mongoose.Schema({
  accountBalance: Number,
  totalProfit: Number,
  totalDeposit: Number,
  totalWithdrawal: Number,
  gasBalance: Number,
  transactions: Array,
  investments: Array,
});

const User = mongoose.models.User || mongoose.model("User", UserSchema);

async function generateRealisticHistory() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Connected to MongoDB...");

    const user = await User.findById(USER_ID);
    if (!user) throw new Error("User not found");

    // Clear existing to start fresh for this simulation
    user.transactions = [];
    user.investments = [];

    // Reset balances to seed values
    let currentBalance = 0;
    let totalDeposit = 0;
    let totalProfit = 0;
    let totalWithdrawal = 0;
    let gasBalance = 0;

    const startDate = new Date("2023-01-01");
    const endDate = new Date("2026-03-09");
    const totalDays = (endDate - startDate) / (1000 * 60 * 60 * 24);

    let activeInvestment = null;
    let rejectedCount = 0;

    for (let i = 0; i < 400; i++) {
      // Distribute 400 transactions over 3 years
      const txDate = new Date(
        startDate.getTime() + i * (totalDays / 400) * 24 * 60 * 60 * 1000,
      );
      let txType = "";
      let amount = 0;
      let status =
        rejectedCount < 6 && Math.random() > 0.95 ? "rejected" : "approved";
      if (status === "rejected") rejectedCount++;

      // Logic to choose transaction type
      const dice = Math.random();

      if (dice < 0.15 || i < 5) {
        // Deposit
        txType = "deposit";
        amount = Math.floor(Math.random() * 5000000) + 100000;
        if (status === "approved") {
          currentBalance += amount;
          totalDeposit += amount;
        }
        user.transactions.push({
          type: "deposit",
          title: "Account Deposit",
          description: `Deposit: $${amount.toLocaleString()} (USDT-TRC20)`,
          amount: amount,
          coin: "USDT",
          status: status,
          date: txDate,
        });
      } else if (dice < 0.4 && activeInvestment) {
        // Weekly Profit
        txType = "profit";
        const weeklyRate = activeInvestment.plan === "business" ? 0.35 : 0.15;
        amount = activeInvestment.amount * weeklyRate;

        if (status === "approved") {
          currentBalance += amount;
          totalProfit += amount;
        }
        user.transactions.push({
          type: "profit",
          title: "Weekly Investment Profit",
          description: `$${amount.toLocaleString()} profit has been added to your account balance.`,
          amount: amount,
          coin: "USD",
          status: "approved", // Profits usually aren't rejected
          date: txDate,
        });
      } else if (dice < 0.55) {
        // Investment Action
        if (!activeInvestment || Math.random() > 0.7) {
          txType = "investment";
          amount = Math.floor(Math.random() * 10000000) + 500000;
          const plan = Math.random() > 0.5 ? "business" : "standard";

          if (currentBalance >= amount && status === "approved") {
            currentBalance -= amount;
            activeInvestment = {
              plan,
              amount,
              startDate: txDate,
              active: true,
            };
            user.investments.push(activeInvestment);

            user.transactions.push({
              type: "investment",
              title: "Investment Initiated",
              description: `You invested $${amount.toLocaleString()} into the ${plan} plan`,
              amount: amount,
              coin: "USD",
              status: "approved",
              date: txDate,
            });
          }
        }
      } else if (dice < 0.75) {
        // Withdrawal or Wallet Transfer
        const isInternal = Math.random() > 0.5;
        txType = isInternal ? "transfer" : "withdrawal";
        amount = Math.floor(Math.random() * 1000000) + 50000;

        if (currentBalance >= amount) {
          // Force Gas Deposit before withdrawal simulation
          const gasNeeded = amount * 0.01;
          gasBalance += gasNeeded;
          user.transactions.push({
            type: "deposit",
            title: "Gas Deposit",
            description: `Gas Deposit: $${gasNeeded.toLocaleString()} (USDT-TRC20)`,
            amount: gasNeeded,
            coin: "USDT",
            status: "pending",
            date: new Date(txDate.getTime() - 3600000), // 1 hour before
          });

          if (status === "approved") {
            currentBalance -= amount;
            totalWithdrawal += amount;
          }

          user.transactions.push({
            type: txType,
            title: isInternal ? "Wallet Transfer" : "Account Withdrawal",
            description: isInternal
              ? `Transfered to ppe_LW3zzP1${Math.random().toString(36).substring(7)}XMxZ`
              : `Withdrawal: $${amount.toLocaleString()} (USDT-TRC20)`,
            amount: amount,
            coin: "USDT",
            direction: isInternal ? "out" : undefined,
            status: status,
            date: txDate,
          });
        }
      }
    }

    // Apply calculated totals to user object
    user.accountBalance = currentBalance;
    user.totalProfit = totalProfit;
    user.totalDeposit = totalDeposit;
    user.totalWithdrawal = totalWithdrawal;
    user.gasBalance = gasBalance;

    await user.save();
    console.log("Successfully generated 400 transactions!");
    process.exit();
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

generateRealisticHistory();
