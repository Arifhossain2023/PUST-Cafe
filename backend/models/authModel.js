import mongoose from "mongoose";

const authSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["admin", "waiter", "kitchen", "cashier"], required: true },
  image: { type: String },
  shift: { type: String, enum: ["Morning", "Evening", "None"], default: "None" }, // ✅ Added shift field here
}, { timestamps: true });

export default mongoose.model("Auth", authSchema);
