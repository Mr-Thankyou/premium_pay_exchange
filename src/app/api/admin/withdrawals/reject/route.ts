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

    if (withdrawal.status === "rejected") {
      return Response.json(
        { success: false, message: "Withdrawal already rejected" },
        { status: 400 }
      );
    }

    // ✅ Update values
    withdrawal.status = "rejected";
    user.accountBalance += withdrawal.amount;
    // user.totalWithdrawal -= withdrawal.amount;

    await user.save();

    // 📧 Send withdrawal rejection email
    await sendEmail({
      to: user.email,
      subject: "Withdrawal Rejected",
      text: `Unfortunately, your withdrawal request of ${withdrawal.amount} ${withdrawal.coin} could not be approved. Please review your request or contact support for assistance.`,
      html: `
    <h2 style="color:#c0392b;">Withdrawal Rejected</h2>
    <p>We regret to inform you that your withdrawal request could not be approved.</p>
    <p><strong>Amount:</strong> ${withdrawal.amount}</p>
    <p><strong>Coin:</strong> ${withdrawal.coin}</p>
    <p>This may be due to verification requirements, insufficient balance, or policy restrictions.</p>
    <p>If you believe this is a mistake or need further clarification, please contact our support team.</p>
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
