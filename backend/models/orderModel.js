// models/orderModel.js
import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  items: { type: Array, required: true },
  amount: { type: Number, required: true },
  address: { type: Object, default: {} }, // Optional shipping/delivery info
  status: { type: String, default: "Food Processing" },
  date: { type: Date, default: Date.now },
  payment: { type: Boolean, default: false }, // false = Unpaid, true = Paid
  billNo: { type: String, unique: true }, // Unique Bill Number
  tableId: { type: mongoose.Schema.Types.ObjectId, ref: "table" }, // for dine-in orders
  deliveryType: {
    type: String,
    enum: ["home-delivery", "dine-in"],
    required: false,   // <-- এখানে required:false দিলাম
  },
  dineInTime: { type: String, default: null }, // Optional: only for dine-in
});

const Order = mongoose.models.Order || mongoose.model("Order", orderSchema);
export default Order;
