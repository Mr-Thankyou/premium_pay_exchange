import cron from "node-cron";
import mongoose from "mongoose";
import User from "@/models/User";

cron.schedule("0 0 * * *", async () => {
  console.log("⏰ Running daily profit job");

  await mongoose.connect(process.env.MONGO_URI!);

  const users = await User.find({ "investments.active": true });

  for (const user of users) {
    let userTotalProfitIncrease = 0;

    for (const investment of user.investments) {
      if (!investment.active) continue;

      const now = new Date();
      const last = investment.lastProfitDate || investment.startDate;

      const daysPassed = Math.floor(
        (now.getTime() - last.getTime()) / (1000 * 60 * 60 * 24)
      );

      if (daysPassed <= 0) continue;

      const dailyProfit = investment.amount * (investment.dailyReturn / 100);

      const profitToAdd = dailyProfit * daysPassed;

      investment.accumulatedProfit += profitToAdd;
      investment.lastProfitDate = now;

      userTotalProfitIncrease += profitToAdd;
    }

    if (userTotalProfitIncrease > 0) {
      user.totalProfit += userTotalProfitIncrease;
      await user.save();
    }
  }

  console.log("✅ Daily profit job completed");
});
