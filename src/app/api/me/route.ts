import { NextResponse } from "next/server";
import { getCurrentUserFull } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUserFull();

    if (!user) {
      return NextResponse.json({ message: "Not logged in" }, { status: 401 });
    }
    return NextResponse.json({ user });
  } catch (error: any) {
    console.error("Error in GET /api/me:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
