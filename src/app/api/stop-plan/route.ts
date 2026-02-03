import { IInvestment } from "./../../../models/Investment";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function POST(req: Request) {
  try {
    await connectDB();

    const body = await req.json();
    const { id } = body;
    const InvestmentId = id;

    if (!id) {
      return NextResponse.json({ error: "Plan ID required" }, { status: 400 });
    }

    // 1. Get auth token
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Fetch user
    const user = await User.findById((decoded as any).id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Find the investment
    const investment = user.investments.id(id);
    if (!investment) {
      return NextResponse.json(
        { error: "Investment plan not found" },
        { status: 404 }
      );
    }

    if (!investment.active) {
      return NextResponse.json(
        { error: "This plan is already inactive" },
        { status: 400 }
      );
    }

    // 5. Calculate final profit up to today
    // const daysPassed =
    //   (Date.now() - new Date(investment.startDate).getTime()) /
    //   (1000 * 60 * 60 * 24);

    // const liveProfit =
    //   investment.amount *
    //   (investment.dailyReturn / 100) *
    //   Math.floor(daysPassed);

    // // Total profit is (saved profit + calculated profit)
    // const finalProfit = (investment.totalProfit || 0) + liveProfit;

    // // 6. Credit user account balance
    // const cashOut = investment.amount + finalProfit;
    // user.accountBalance += cashOut;
    // user.totalProfit += finalProfit;

    // // 7. Mark plan inactive
    // investment.active = false;
    // investment.totalProfit += liveProfit; // update DB profit with live one

    // Cashout Calculation
    const amountInvested = investment.amount;
    const accumulatedProfit = investment.accumulatedProfit || 0;
    const cashOut = amountInvested + accumulatedProfit;

    // Update wallet
    user.accountBalance = (user.accountBalance || 0) + cashOut;

    // Remove investment
    user.investments = user.investments.filter(
      (inv) => inv._id.toString() !== InvestmentId
    );

    // Remove the profit from totalProfit as well
    user.totalProfit = (user.totalProfit || 0) - accumulatedProfit;

    await user.save();

    return NextResponse.json({
      message: `Plan stopped successfully. You cashed out $${cashOut.toFixed(
        2
      )}.`,
      cashOut,
      accumulatedProfit,
    });
  } catch (err: any) {
    console.error("stop-plan error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
