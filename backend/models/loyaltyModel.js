// loyaltyModel.js
import mongoose from "mongoose";

const loyaltySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",  // Reference to User collection
    unique: true,
    required: true,  // যেহেতু loyalty অবশ্যই user এর সাথে linked, required রাখা ভালো
  },
  points: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

const loyaltyModel = mongoose.models.Loyalty || mongoose.model("Loyalty", loyaltySchema);
export default loyaltyModel;
