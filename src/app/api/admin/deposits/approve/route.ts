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
        { status: 404 },
      );
    }

    const deposit = user.deposits.id(depositId);
    if (!deposit) {
      return Response.json(
        { success: false, message: "Deposit not found" },
        { status: 404 },
      );
    }

    if (deposit.status === "approved") {
      return Response.json(
        { success: false, message: "Deposit already approved" },
        { status: 400 },
      );
    }

    const isGas = deposit.type === "GAS";
    const isMain = deposit.type === "MAIN";

    // ✅ Update values
    deposit.status = "approved";

    if (isMain) {
      user.accountBalance += deposit.amount;
      user.totalDeposit += deposit.amount;
    }

    if (isGas) {
      user.gasBalance += deposit.amount;
    }

    if (isMain) {
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
    }

    if (isGas) {
      if (!user.gasFlag) {
        // 🟢 FIRST GAS DEPOSIT
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

        // 🔐 Flip the flag AFTER first gas
        user.gasFlag = true;
      } else {
        // 🔁 NORMAL GAS DEPOSIT
        await sendEmail({
          to: user.email,
          subject: "Gas Deposit Approved",
          text: `Your gas deposit of ${deposit.amount} ${deposit.coin} has been approved.`,
          html: `
        <h2>Gas Deposit Approved</h2>
        <p>Your gas deposit has been approved.</p>
        <p><strong>Amount:</strong> ${deposit.amount}</p>
        <p><strong>Coin:</strong> ${deposit.coin}</p>
      `,
        });
      }
    }

    return Response.json({ success: true });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message || "Something went wrong",
      },
      { status: 500 },
    );
  }
}
