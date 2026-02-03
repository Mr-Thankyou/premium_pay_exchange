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

    if (deposit.status === "approved") {
      return Response.json(
        { success: false, message: "Deposit already approved" },
        { status: 400 }
      );
    }

    // ✅ Update values
    deposit.status = "approved";
    user.accountBalance += deposit.amount;
    user.totalDeposit += deposit.amount;

    await user.save();

    // 📧 Send approval email
    await sendEmail({
      to: user.email,
      subject: "Deposit Approved",
      text: `Your deposit of ${deposit.amount} ${deposit.coin} has been approved.`,
      html: `
    <h2>Deposit Approved</h2>
    <p>Your deposit request has been approved, and your account has been successfully credited.</p>
    <p><strong>Amount:</strong> ${deposit.amount}</p>
    <p><strong>Coin:</strong> ${deposit.coin}</p>
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
