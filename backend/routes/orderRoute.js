import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  placeOrder,
  listOrders,
  updateStatus,
  userOrders,
  verifyOrder,
  getOrderById,
  getOrdersByTable,
  updateOrder,   // ইম্পোর্ট করলাম
} from "../controllers/orderController.js";

const orderRouter = express.Router();

orderRouter.get("/list", listOrders);
orderRouter.get("/list/all", listOrders);
orderRouter.get("/:orderId", getOrderById);

// টেবিল অনুযায়ী অর্ডার দেখাবে
orderRouter.get("/table/:tableId", authMiddleware, getOrdersByTable);

// নতুন: অর্ডার আপডেট করার রাউট
orderRouter.post("/update", authMiddleware, updateOrder);

orderRouter.post("/userorders", authMiddleware, userOrders);
orderRouter.post("/place", authMiddleware, placeOrder);
orderRouter.post("/status", authMiddleware, updateStatus);
orderRouter.post("/verify", authMiddleware, verifyOrder);

export default orderRouter;
