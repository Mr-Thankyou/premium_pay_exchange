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
    const { userId, coin, amount, screenshotBase64, depositAddress } =
      await req.json();

    if (authUser._id.toString() !== userId)
      return Response.json({ error: "Forbidden" }, { status: 403 });

    const fullUser = await User.findById(userId);

    if (!fullUser)
      return Response.json({ error: "User not found" }, { status: 404 });

    fullUser.deposits.push({
      coin,
      amount,
      screenshot: screenshotBase64,
      depositAddress,
      status: "pending",
    });

    fullUser.transactions.push({
      type: "deposit",
      title: "Account Deposit",
      description: `Deposit: $${amount} (${coin})`,
      amount,
      coin,
      status: "pending",
    });

    await fullUser.save();

    // 📧 SEND EMAIL (PENDING)
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

    return Response.json({ message: "Deposit submitted" });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Something went wrong";
    return Response.json({ error: message }, { status: 500 });
  }
}
