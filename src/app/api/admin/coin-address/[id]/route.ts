// import { requireAdmin } from "@/lib/authAdmin";
// import { connectDB } from "@/lib/mongodb";
// import CoinAddress from "@/models/CoinAddress";
// import { NextResponse } from "next/server";

// export async function PUT(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();
//   if (!(await requireAdmin()))
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   const data = await req.json();
//   const coinAddress = await CoinAddress.findByIdAndUpdate(params.id, data, {
//     new: true,
//   });
//   return NextResponse.json(coinAddress);
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   await connectDB();
//   if (!(await requireAdmin()))
//     return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

//   await CoinAddress.findByIdAndDelete(params.id);
//   return NextResponse.json({ message: "Coin Address deleted" });
// }

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CoinAddress from "@/models/CoinAddress";
import { requireAdmin } from "@/lib/authAdmin";

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const doc = await CoinAddress.findById(id).lean();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(doc);
}

export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const updated = await CoinAddress.findByIdAndUpdate(id, body, {
    new: true,
  }).lean();
  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  await connectDB();
  if (!(await requireAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await CoinAddress.findByIdAndDelete(id);
  return NextResponse.json({ message: "Deleted" });
}
