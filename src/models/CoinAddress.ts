import mongoose, { Schema, Document, models } from "mongoose";

export interface ICoinAddress extends Document {
  coin: "BTC" | "USDT-TRC20" | "ETH";
  address: string;
}

const CoinAddressSchema = new Schema<ICoinAddress>({
  coin: { type: String, required: true, unique: true },
  address: { type: String, required: true },
});

const CoinAddress =
  models.CoinAddress ||
  mongoose.model<ICoinAddress>("CoinAddress", CoinAddressSchema);

export default CoinAddress;
