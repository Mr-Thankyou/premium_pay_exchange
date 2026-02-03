import { NextResponse } from "next/server";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin } from "@/lib/authAdmin";

export async function GET() {
  await connectDB();
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const users = await User.find().lean();
  return NextResponse.json(users);
}

export async function POST(req: Request) {
  await connectDB();
  const admin = await requireAdmin();
  if (!admin)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const user = await User.create(data);

  return NextResponse.json(user);
}
