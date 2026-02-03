import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CoinAddress from "@/models/CoinAddress";

export async function GET(req: Request) {
  await connectDB();

  const { searchParams } = new URL(req.url);
  const coin = searchParams.get("coin");

  if (!coin) {
    return NextResponse.json({ error: "Coin is required" }, { status: 400 });
  }

  const address = await CoinAddress.findOne({ coin });

  if (!address) {
    return NextResponse.json({ error: "Address not found" }, { status: 404 });
  }

  return NextResponse.json(address, { status: 200 });
}
