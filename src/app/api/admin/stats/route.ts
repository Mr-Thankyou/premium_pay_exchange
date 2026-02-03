// app/api/admin/stats/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stats from "@/models/Stats";
import { requireAdmin } from "@/lib/authAdmin";

export async function GET() {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  // assume single stats doc — return the latest or empty
  const stat = await Stats.findOne().sort({ createdAt: -1 }).lean();
  return NextResponse.json(stat || null);
}

export async function POST(req: Request) {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const created = await Stats.create(body);
  return NextResponse.json(created);
}

export async function PUT(req: Request) {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  // expect body to contain _id to update
  if (!body._id)
    return NextResponse.json({ error: "_id required" }, { status: 400 });

  const updated = await Stats.findByIdAndUpdate(body._id, body, {
    new: true,
  }).lean();
  return NextResponse.json(updated);
}
