import { NextResponse } from "next/server";
import crypto from "crypto";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import sendEmail from "@/lib/sendEmail";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { email } = await req.json();

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ message: "Email not found" }, { status: 400 });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpire = Date.now() + 15 * 60 * 1000; // 15 mins

    user.resetToken = resetToken;
    user.resetTokenExpire = tokenExpire;
    await user.save();

    const link = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "Password Reset",
      text: `Reset your password here: ${link}`,
    });

    return NextResponse.json({ message: "Reset link sent" });
  } catch (err) {
    console.log("Reset Passoword Error", err);
    return NextResponse.json(
      { message: "Something went wrong, try again later" },
      { status: 500 }
    );
  }
}
