import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Stats from "@/models/Stats";

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json(); // expect { tradersOnline?, totalRegistered?, dealsToday? }

  // Use findOneAndUpdate with upsert to create if missing
  const updated = await Stats.findOneAndUpdate(
    {},
    {
      $set: {
        ...(typeof body.tradersOnline === "number"
          ? { tradersOnline: body.tradersOnline }
          : {}),
        ...(typeof body.totalRegistered === "number"
          ? { totalRegistered: body.totalRegistered }
          : {}),
        ...(typeof body.dealsToday === "number"
          ? { dealsToday: body.dealsToday }
          : {}),
      },
    },
    { upsert: true, new: true }
  );

  return NextResponse.json({ success: true, data: updated });
}
