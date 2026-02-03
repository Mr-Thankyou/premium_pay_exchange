import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define MONGODB_URI inside .env.local");
}

let isConnected = false;

export const connectDB = async () => {
  if (isConnected) return;

  try {
    const db = await mongoose.connect(MONGODB_URI);
    isConnected = !!db.connections[0].readyState;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed:", error);
  }
};

// useraname: premium_pay_exchange
// password: ajexUbcmag1sbWej
// mongodb+srv://premium_pay_exchange:ajexUbcmag1sbWej@cluster0.r2zbijg.mongodb.net/?appName=Cluster0
