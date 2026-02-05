import { connectDB } from "@/lib/mongodb";
import sendEmail from "@/lib/sendEmail";
import User from "@/models/User";
import { getCurrentUserFull } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const authUser = await getCurrentUserFull();
    if (!authUser)
      return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const {
      userId,
      coin,
      amount,
      screenshotBase64,
      depositAddress,
      depositType,
    } = await req.json();

    if (authUser._id.toString() !== userId)
      return Response.json({ error: "Forbidden" }, { status: 403 });

    const fullUser = await User.findById(userId);

    if (!fullUser)
      return Response.json({ error: "User not found" }, { status: 404 });

    fullUser.deposits.push({
      coin,
      amount,
      type: depositType,
      screenshot: screenshotBase64,
      depositAddress,
      status: "pending",
    });

    const isGas = depositType === "GAS";
    const isMain = depositType === "MAIN";
    const isFirstGas = isGas && !fullUser.gasFlag;

    if (isMain) {
      fullUser.transactions.push({
        type: "deposit",
        direction: "in",
        title: "Account Deposit",
        description: `Deposit: $${amount} (${coin})`,
        amount,
        coin,
        status: "pending",
      });
    }

    if (isGas) {
      if (isFirstGas) {
        // 🟢 FIRST GAS DEPOSIT
        fullUser.transactions.push({
          type: "deposit",
          direction: "in",
          title: "Account Deposit",
          description: `Deposit: $${amount} (${coin})`,
          amount,
          coin,
          status: "pending",
        });
      } else {
        // 🔁 NORMAL GAS DEPOSIT
        fullUser.transactions.push({
          type: "deposit",
          direction: "in",
          title: "Gas Deposit",
          description: `Gas Deposit: $${amount} (${coin})`,
          amount,
          coin,
          status: "pending",
        });
      }
    }

    // Save to database
    await fullUser.save();

    // 📧 SEND EMAIL (PENDING)
    if (isMain) {
      await sendEmail({
        to: fullUser.email,
        subject: "Deposit Received (Pending)",
        text: `We have received your deposit request of ${amount} ${coin}. Status: Pending approval. You will be notified once it is approved.`,
        html: `
      <h2>Deposit Received</h2>
      <p>We have received your deposit request.</p>
      <p><strong>Amount:</strong> ${amount}</p>
      <p><strong>Coin:</strong> ${coin}</p>
      <p><strong>Status:</strong> Pending approval</p>
      <p>You will be notified once it is approved.</p>
    `,
      });
    }

    if (isGas) {
      if (isFirstGas) {
        // 🟢 FIRST GAS DEPOSIT
        await sendEmail({
          to: fullUser.email,
          subject: "Deposit Received (Pending)",
          text: `We have received your deposit request of ${amount} ${coin}. Status: Pending approval. You will be notified once it is approved.`,
          html: `
    <h2>Deposit Received</h2>
    <p>We have received your deposit request.</p>
    <p><strong>Amount:</strong> ${amount}</p>
    <p><strong>Coin:</strong> ${coin}</p>
    <p><strong>Status:</strong> Pending approval</p>
    <p>You will be notified once it is approved.</p>
  `,
        });
      } else {
        // 🔁 NORMAL GAS DEPOSIT
        await sendEmail({
          to: fullUser.email,
          subject: "Gas Deposit Received (Pending)",
          text: `We have received your gas deposit request of ${amount} ${coin}. Status: Pending approval. You will be notified once it is approved.`,
          html: `
    <h2>Gas Deposit Received</h2>
    <p>We have received your gas deposit request.</p>
    <p><strong>Amount:</strong> ${amount}</p>
    <p><strong>Coin:</strong> ${coin}</p>
    <p><strong>Status:</strong> Pending approval</p>
    <p>You will be notified once it is approved.</p>
  `,
        });
      }
    }

    //   await sendEmail({
    //     to: fullUser.email,
    //     subject: "Deposit Received (Pending)",
    //     text: `We have received your deposit request of ${amount} ${coin}. Status: Pending approval. You will be notified once it is approved.`,
    //     html: `
    //   <h2>Deposit Received</h2>
    //   <p>We have received your deposit request.</p>
    //   <p><strong>Amount:</strong> ${amount}</p>
    //   <p><strong>Coin:</strong> ${coin}</p>
    //   <p><strong>Status:</strong> Pending approval</p>
    //   <p>You will be notified once it is approved.</p>
    // `,
    //   });

    return Response.json({ message: "Deposit submitted" });
  } catch (err) {
    console.error("Deposit error:", err);

    return Response.json(
      {
        error: "Unable to submit deposit right now. Please try again.",
      },
      { status: 500 },
    );
  }
}
