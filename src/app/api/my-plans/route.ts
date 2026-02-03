import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export async function GET() {
  try {
    await connectDB();

    // 1. Get token from cookies
    const token = (await cookies()).get("auth_token")?.value;
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 2. Decode token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    // 3. Fetch user (exclude password for safety)
    const user = await User.findById((decoded as any).id).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 4. Filter active plans
    const activePlans = user.investments.filter((inv) => inv.active);

    // 5. (Optional) Calculate live profit based on days passed
    const enrichedPlans = activePlans.map((inv) => {
      const daysPassed =
        (Date.now() - new Date(inv.startDate).getTime()) /
        (1000 * 60 * 60 * 24);

      const liveProfit =
        inv.amount * (inv.dailyReturn / 100) * Math.floor(daysPassed);

      return {
        ...inv.toObject(),
        liveProfit: Number(liveProfit.toFixed(2)),
      };
    });

    return NextResponse.json({
      plans: enrichedPlans,
    });
  } catch (err: any) {
    console.error("my-plans error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
