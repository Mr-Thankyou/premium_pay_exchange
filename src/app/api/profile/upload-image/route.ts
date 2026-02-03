import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import cloudinary from "@/lib/cloudinary";
import { getCurrentUserFull } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    await connectDB();

    const user = await getCurrentUserFull();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("image") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No image uploaded" }, { status: 400 });
    }

    // Read the image bytes from the browser format and repackage them into a Node.js format so Cloudinary can read them
    // Convert the uploaded image into a Node.js–compatible binary format
    // Cloudinary cannot work with browser File objects directly.
    // In the browser, file bytes are represented as an ArrayBuffer.
    // Since Cloudinary’s Node.js SDK does not understand ArrayBuffer,
    // we convert the ArrayBuffer into a Node.js Buffer (raw bytes)
    // before streaming it to Cloudinary.
    const buffer = Buffer.from(await file.arrayBuffer());

    const uploadResult: any = await new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            folder: "ppe/profile-images",
            resource_type: "image",
          },
          (error, result) => {
            if (error) reject(error);
            resolve(result);
          },
        )
        .end(buffer);
    });

    user.profileImage = uploadResult.secure_url;
    await user.save();

    return NextResponse.json({
      message: "Profile image updated",
      profileImage: uploadResult.secure_url,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Image upload failed" }, { status: 500 });
  }
}

// Read the image bytes from the browser format and repackage them into a Node.js format so Cloudinary can read them
// DETAIL EXPLANATION: Cloudinary needs raw bytes, not a browser File.
// when you want to send it to cloudinary, since we cant send the files directly, we send the bytes
// the bytes is stored in Browser ArrayBuffer Object
// since nodejs that runs on cloudinary doesn't understand arrayBuffer bytes, we convert it to buffer object before sending
