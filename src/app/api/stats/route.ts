import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stats from "@/models/Stats";

export async function GET() {
  await connectDB();

  let stats = await Stats.findOne({});
  if (!stats) {
    // create initial default document if none exists
    stats = await Stats.create({
      tradersOnline: 0,
      totalRegistered: 0,
      dealsToday: 0,
    });
  }

  return NextResponse.json({
    success: true,
    data: stats,
  });
}
