import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { userId, depositId } = await req.json();

    const user = await User.findById(userId);
    if (!user) {
      return Response.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    const deposit = user.deposits.id(depositId);
    if (!deposit) {
      return Response.json(
        { success: false, message: "Deposit not found" },
        { status: 404 }
      );
    }

    if (deposit.status === "rejected") {
      return Response.json(
        { success: false, message: "Deposit already rejected" },
        { status: 400 }
      );
    }

    // ✅ Update values
    deposit.status = "rejected";
    // user.accountBalance -= deposit.amount;
    // user.totalDeposit -= deposit.amount;

    await user.save();

    // 📧 Deposit rejection email
    await sendEmail({
      to: user.email,
      subject: "Deposit Rejected",
      text: `Unfortunately, your deposit of ${deposit.amount} ${deposit.coin} could not be approved. Please review your deposit details or contact support for assistance.`,
      html: `
    <h2 style="color:#c0392b;">Deposit Rejected</h2>
    <p>We regret to inform you that your deposit request could not be approved.</p>
    <p><strong>Amount:</strong> ${deposit.amount}</p>
    <p><strong>Coin:</strong> ${deposit.coin}</p>
    <p>This may be due to incorrect payment details, incomplete confirmation, or verification issues.</p>
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
