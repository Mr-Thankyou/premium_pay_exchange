import { requireAdmin } from "@/lib/authAdmin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, depositId, status } = await req.json();

  const user = await User.findById(userId);
  const dep = user.deposits.id(depositId);

  dep.status = status;

  await user.save();

  return NextResponse.json({ message: "Deposit updated" });
}
