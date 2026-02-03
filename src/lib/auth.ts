import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import User from "@/models/User";
import { connectDB } from "@/lib/mongodb";

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    // console.log("Token in auth.ts:", token);

    if (!token) return null;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!);

    return decoded;
  } catch (err) {
    return null;
  }
}

export async function getCurrentUserFull() {
  try {
    await connectDB();
    const cookieStore = await cookies();
    const token = await cookieStore.get("auth_token")?.value;
    // if (!token) return null;
    if (!token) return undefined;

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      id: string;
    };

    const user = await User.findById(decoded.id).select("-password");
    return user;
  } catch (err) {
    return undefined;
  }
}
