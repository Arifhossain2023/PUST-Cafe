import dotenv from "dotenv";
dotenv.config();

import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import tableModel from "../models/tableModel.js";
import mongoose from "mongoose";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const currency = "inr";
const deliveryCharge = 50;
const frontend_URL = "http://localhost:3000";

const generateBillNo = async () => {
  const count = await orderModel.countDocuments();
  return `BILL-${1000 + count + 1}`;
};

const placeOrder = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      items,
      amount,
      address = {},
      tableId,
      deliveryType,
      dineInTime,
      source,  // নতুন: order কোথা থেকে আসছে
    } = req.body;

    // যদি user panel থেকে আসে তাহলে deliveryType দরকার
    if (source === "user") {
      if (!deliveryType) {
        return res.status(400).json({
          success: false,
          message: "Delivery type is required for user orders",
        });
      }
      if (deliveryType === "dine-in" && !dineInTime) {
        return res.status(400).json({
          success: false,
          message: "Please provide dine-in visit time",
        });
      }
    }

    const billNo = await generateBillNo();

    const newOrder = new orderModel({
      userId,
      items,
      amount,
      address,
      billNo,
      tableId,
      deliveryType: deliveryType || null,
      dineInTime: dineInTime || null,
    });

    await newOrder.save();

    // Empty user cart
    await userModel.findByIdAndUpdate(userId, { cartData: {} });

    // Reserve table
    if (tableId) {
      await tableModel.findByIdAndUpdate(tableId, { status: "Reserved" });
    }

    // Stripe checkout line items
    const line_items = items.map((item) => ({
      price_data: {
        currency,
        product_data: { name: item.name },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity,
    }));

    if (deliveryType === "home-delivery") {
      line_items.push({
        price_data: {
          currency,
          product_data: { name: "Delivery Charge" },
          unit_amount: deliveryCharge * 100,
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items,
      mode: "payment",
      success_url: `${frontend_URL}/verify?success=true&orderId=${newOrder._id}`,
      cancel_url: `${frontend_URL}/verify?success=false&orderId=${newOrder._id}`,
    });

    res.json({ success: true, session_url: session.url });
  } catch (error) {
    console.error("❌ Place Order Error:", error.message);
    res.status(500).json({ success: false, message: "Stripe error: " + error.message });
  }
};

const listOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({}).populate("tableId");
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ List Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching orders" });
  }
};

const userOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({ userId: req.user.id }).populate("tableId");
    res.json({ success: true, data: orders });
  } catch (error) {
    console.error("❌ User Orders Error:", error.message);
    res.status(500).json({ success: false, message: "Error fetching user orders" });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;
    const isPaid = status === "Paid";

    const order = await orderModel.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    await orderModel.findByIdAndUpdate(orderId, { status, payment: isPaid });

    if (isPaid || status === "Delivered") {
      if (order.tableId) {
        await tableModel.findByIdAndUpdate(order.tableId, { status: "Free" });
      }
    }

    res.json({ success: true, message: "Status updated" });
  } catch (error) {
    console.error("❌ Update Status Error:", error.message);
    res.status(500).json({ success: false, message: "Error updating status" });
  }
};

const verifyOrder = async (req, res) => {
  const { orderId, success } = req.body;
  try {
    if (success === "true") {
      await orderModel.findByIdAndUpdate(orderId, { payment: true });
      res.json({ success: true, message: "Payment verified" });
    } else {
      await orderModel.findByIdAndDelete(orderId);
      res.json({ success: false, message: "Payment failed or canceled" });
    }
  } catch (error) {
    console.error("❌ Verify Order Error:", error.message);
    res.status(500).json({ success: false, message: "Verification failed" });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await orderModel.findById(req.params.orderId).populate("tableId");
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }
    res.json({ success: true, data: order });
  } catch (error) {
    console.error("❌ Get Order By ID Error:", error.message);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

const getOrdersByTable = async (req, res) => {
  try {
    const { tableId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tableId)) {
      return res.status(400).json({ success: false, message: "Invalid table ID" });
    }

    const orders = await orderModel.find({ tableId }).populate("tableId");

    res.json({
      success: true,
      data: orders,
      message: orders.length ? undefined : "No orders for this table",
    });
  } catch (error) {
    console.error("❌ Get Orders By Table Error:", error.message);
    res.status(500).json({ success: false, message: "Failed to fetch orders" });
  }
};

const updateOrder = async (req, res) => {
  try {
    const { tableId, items, amount, address = {} } = req.body;

    if (!tableId || !Array.isArray(items)) {
      return res.status(400).json({ success: false, message: "Table ID and items are required" });
    }

    const order = await orderModel.findOne({
      tableId,
      status: { $in: ["Pending", "Food Processing", "Confirmed"] },
    });

    if (!order) {
      return res.status(404).json({ success: false, message: "No active order found" });
    }

    order.items = items;
    order.amount = amount;
    order.address = address;
    await order.save();

    res.json({ success: true, message: "Order updated successfully" });
  } catch (error) {
    console.error("❌ updateOrder Error:", error.message);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export {
  placeOrder,
  listOrders,
  userOrders,
  updateStatus,
  verifyOrder,
  getOrderById,
  getOrdersByTable,
  updateOrder,
};
