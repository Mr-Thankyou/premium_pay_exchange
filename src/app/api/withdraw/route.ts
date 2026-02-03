// app/api/withdraw/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
// import { getUserFromCookieRequest } from "@/lib/auth";
import { getCurrentUserFull } from "@/lib/auth";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getCurrentUserFull();
    if (!user)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { coin, amount, address } = await req.json();
    const num = Number(amount || 0);

    if (!coin || !amount || !address)
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });

    // rules (per your spec in USD)
    if (num < 60000 || num > 200000) {
      return NextResponse.json(
        { error: "Amount must be between 60,000 and 200,000" },
        { status: 400 },
      );
    }

    if ((user.accountBalance || 0) < num) {
      return NextResponse.json(
        { error: "Insufficient funds" },
        { status: 400 },
      );
    }

    // deduct immediately (pending payout)
    user.accountBalance = (user.accountBalance || 0) - num;
    // user.totalWithdrawal = (user.totalWithdrawal || 0) + num;
    user.withdrawals = user.withdrawals || [];
    user.withdrawals.push({
      coin,
      amount: num,
      address,
      status: "pending",
      date: new Date(),
    });

    user.transactions.push({
      type: "withdrawal",
      title: "Account Withdrawal",
      description: `Withdrawal: $${amount} (${coin})`,
      amount,
      coin,
      status: "pending",
    });

    await user.save();

    // 📧 SEND EMAIL (PENDING)
    await sendEmail({
      to: user.email,
      subject: "Withdrawal Request Received (Pending)",
      text: `We have received your withdrawal request of ${amount} ${coin}. Your request is currently pending admin review. You will be notified once it is processed.`,
      html: `
    <h2>Withdrawal Request Received</h2>
    <p>We have received your withdrawal request and it is currently under review.</p>
    <p><strong>Amount:</strong> ${amount}</p>
    <p><strong>Coin:</strong> ${coin}</p>
    <p><strong>Status:</strong> Pending admin approval</p>
    <p>You will be notified once your withdrawal request has been approved or rejected.</p>
  `,
    });

    return NextResponse.json({ message: "Withdrawal requested" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
