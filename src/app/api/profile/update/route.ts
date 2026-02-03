import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { getCurrentUserFull } from "@/lib/auth";

export async function PUT(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUserFull();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { fullname, email, phone } = await req.json();

    if (!fullname || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    user.fullname = fullname;
    user.email = email;
    user.phone = phone;

    await user.save();

    return NextResponse.json({
      message: "Profile updated",
      user: {
        fullname: user.fullname,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: "Profile update failed" },
      { status: 500 },
    );
  }
}
