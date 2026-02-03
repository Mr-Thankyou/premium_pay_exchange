import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import generateWalletAddress from "@/utils/generateAddress";

export async function POST(req: Request) {
  try {
    await connectDB();

    const {
      username,
      fullname,
      email,
      phone,
      password,
      confirmPassword,
      currency,
      country,
      referral,
    } = await req.json();

    // Validate required fields
    if (
      !username ||
      !fullname ||
      !email ||
      !phone ||
      !password ||
      !currency ||
      !country
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 },
      );
    }

    // Check password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: "Passwords do not match" },
        { status: 400 },
      );
    }

    // Check if username exists
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return NextResponse.json(
        { error: "Username already taken" },
        { status: 400 },
      );
    }

    // Check if email exists
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 400 },
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const walletAddress = generateWalletAddress();

    // Create new user
    const newUser = await User.create({
      username,
      fullname,
      email,
      phone,
      password: hashedPassword,
      savedPassword: password,
      currency,
      country,
      referral: referral || "",
      role: "user",
      walletAddress,
    });

    console.log("New user created:", newUser);
    return NextResponse.json(
      { message: "Registration successful", user: newUser },
      { status: 201 },
    );
  } catch (err) {
    console.log(err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
