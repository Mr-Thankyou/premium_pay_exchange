import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import CoinAddress from "@/models/CoinAddress";

export async function GET() {
  await connectDB();

  const addresses = [
    {
      coin: "BTC",
      address: "bc1q9x0k4s4t0y3u7p9h5j8v6r2l4m3n8d6f0q2aw3",
    },
    {
      coin: "USDT-TRC20",
      address: "TF8a92KJ4w3x7bLm92tJ8fH6kL4Zp0Qx9n",
    },
    {
      coin: "ETH",
      address: "0xA3b92F4E98Cef12B7C4D6aF89e9D2A7064bC015E",
    },
  ];

  // Avoid duplicates
  for (const item of addresses) {
    await CoinAddress.updateOne(
      { coin: item.coin },
      { $set: item },
      { upsert: true }
    );
  }

  return NextResponse.json({ message: "Addresses seeded!" });
}
