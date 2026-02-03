import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, withdrawalId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const withdrawal = user.withdrawals.id(withdrawalId);
    if (!withdrawal) {
      return Response.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 }
      );
    }

    if (withdrawal.status === "approved") {
      return Response.json(
        { success: false, message: "Withdrawal already approved" },
        { status: 400 }
      );
    }

    // ✅ Update values
    withdrawal.status = "approved";
    user.totalWithdrawal = (user.totalWithdrawal || 0) + withdrawal.amount;

    await user.save();

    // 📧 Send withdrawal approval email
    await sendEmail({
      to: user.email,
      subject: "Withdrawal Approved",
      text: `Your withdrawal request of ${withdrawal.amount} ${withdrawal.coin} has been approved and is being processed.`,
      html: `
    <h2 style="color:#2a5276;">Withdrawal Approved</h2>
    <p>Your withdrawal request has been approved and is currently being processed.</p>
    <p><strong>Amount:</strong> ${withdrawal.amount}</p>
    <p><strong>Coin:</strong> ${withdrawal.coin}</p>
    <p>Please note that processing times may vary depending on network conditions.</p>
    <p>You will receive a confirmation once the funds have been successfully sent.</p>
  `,
    });

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 }
    );
  }
}
