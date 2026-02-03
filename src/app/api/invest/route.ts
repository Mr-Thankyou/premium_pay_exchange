import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { getCurrentUserFull } from "@/lib/auth";

const PLANS: Record<string, { min: number; max: number; pct: number }> = {
  beginner: { min: 500, max: 4000, pct: 1.5 },
  standard: { min: 5000, max: 9000, pct: 3.5 },
  business: { min: 10000, max: Number.POSITIVE_INFINITY, pct: 7.5 },
};

export async function POST(req: Request) {
  try {
    await connectDB();
    // const user = await getUserFromCookieRequest(req);
    const user = await getCurrentUserFull();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { plan, amount } = await req.json();
    if (!plan || !amount)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    const p = PLANS[plan];
    if (!p)
      return NextResponse.json({ error: "Invalid plan" }, { status: 400 });

    const num = Number(amount);
    if (num < p.min)
      return NextResponse.json({ error: `Minimum ${p.min}` }, { status: 400 });
    if (num > p.max)
      return NextResponse.json({ error: `Maximum ${p.max}` }, { status: 400 });

    // fetch fresh user document
    const u = await User.findById(user._id);
    if (!u)
      return NextResponse.json({ error: "User not found" }, { status: 404 });

    if ((u.accountBalance || 0) < num)
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 },
      );

    u.accountBalance = (u.accountBalance || 0) - num;
    u.investments = u.investments || [];
    u.investments.push({
      plan,
      amount: num,
      dailyReturn: p.pct,
      startDate: new Date(),
      active: true,
      accumulatedProfit: 0,
    });

    u.transactions.push({
      type: "investment",
      title: "Investment Initiated",
      description: `You invested $${num} into the ${plan} plan`,
      amount: num,
      coin: "USD",
      status: "approved",
    });

    await u.save();
    return NextResponse.json({ message: "Investment started" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
