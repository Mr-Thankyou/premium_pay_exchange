import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const baseUrl = new URL(req.url).origin; // get http://localhost:3000

  const res = NextResponse.redirect(`${baseUrl}/`);

  res.cookies.set("auth_token", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    expires: new Date(0),
  });

  return res;
}
