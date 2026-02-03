import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function POST(req: Request) {
  try {
    await connectDB();

    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }, // token not expired
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    const hashed = await bcrypt.hash(password, 10);

    user.password = hashed;
    user.savedPassword = password;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    return NextResponse.json(
      { message: "Password updated successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
