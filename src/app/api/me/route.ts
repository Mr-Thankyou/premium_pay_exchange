import { NextResponse } from "next/server";
import { getCurrentUserFull } from "@/lib/auth";

export async function GET() {
  //   const user = await getCurrentUser();
  const user = await getCurrentUserFull();

  if (!user) {
    return NextResponse.json({ message: "Not logged in" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
