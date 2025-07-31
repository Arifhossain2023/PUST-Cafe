// ✅ userModel.js
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["student", "teacher"], required: true },
  image: { type: String },
});

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;