import { requireAdmin } from "@/lib/authAdmin";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { userId, investId, update } = await req.json();

  const user = await User.findById(userId);
  const inv = user.investments.id(investId);

  Object.assign(inv, update);

  await user.save();

  return NextResponse.json({ message: "Investment updated" });
}
