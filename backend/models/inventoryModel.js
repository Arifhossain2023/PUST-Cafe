// ✅ inventoryModel.js
import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
});

const inventoryModel = mongoose.models.inventory || mongoose.model("inventory", inventorySchema);

export default inventoryModel;