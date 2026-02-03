import { requireAdmin } from "@/lib/authAdmin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;

  await connectDB();

  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await User.findById(id).lean();

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json(user);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const user = await User.findById(id);

  if (!user)
    return NextResponse.json({ error: "User not found" }, { status: 404 });

  // Only update password if it exists
  if (data.password && data.password.length > 0) {
    const hashed = await bcrypt.hash(data.password, 10);
    user.savedPassword = data.password;
    user.password = hashed;
  }

  // Update other fields
  for (const key in data) {
    if (key !== "password") {
      user[key] = data[key];
    }
  }

  // Validate transactions (server-side protection)
  if (Array.isArray(data.transactions)) {
    for (const tx of data.transactions) {
      if (!tx.type || !tx.direction || !tx.title || !tx.amount || !tx.coin) {
        return NextResponse.json(
          { error: "Invalid transaction data" },
          { status: 400 },
        );
      }

      if (tx.type === "withdrawal" && tx.direction !== "out") {
        return NextResponse.json(
          { error: "Withdrawal must be OUT" },
          { status: 400 },
        );
      }

      if (tx.type === "deposit" && tx.direction !== "in") {
        return NextResponse.json(
          { error: "Deposit must be IN" },
          { status: 400 },
        );
      }

      if (tx.type === "investment" && tx.direction !== "out") {
        return NextResponse.json(
          { error: "Investment must be OUT" },
          { status: 400 },
        );
      }
    }
  }

  await user.save();

  return NextResponse.json(user);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await User.findByIdAndDelete(id);
  return NextResponse.json({ message: "User deleted" });
}
