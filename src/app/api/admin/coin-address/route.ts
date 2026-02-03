import { requireAdmin } from "@/lib/authAdmin";
import { connectDB } from "@/lib/mongodb";
import CoinAddress from "@/models/CoinAddress";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const addresses = await CoinAddress.find();
  return NextResponse.json(addresses);
}

export async function POST(req: Request) {
  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await req.json();
  const newAddress = await CoinAddress.create(data);
  return NextResponse.json(newAddress);
}
