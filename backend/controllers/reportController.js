import orderModel from "../models/orderModel.js";
import foodModel from "../models/foodModel.js";
import inventoryModel from "../models/inventoryModel.js";

// Daily Sales Report
export const dailySales = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const orders = await orderModel.find({
      date: { $gte: today },
      payment: true,
    });

    const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = orders.length;

    res.json({ success: true, data: { totalSales, totalOrders } });
  } catch (err) {
    res.json({ success: false, message: "Error generating report" });
  }
};

// Top Selling Items
export const topItems = async (req, res) => {
  try {
    const orders = await orderModel.find();
    const itemCount = {};

    orders.forEach((order) => {
      order.items.forEach((item) => {
        if (!itemCount[item.name]) {
          itemCount[item.name] = item.quantity;
        } else {
          itemCount[item.name] += item.quantity;
        }
      });
    });

    const sorted = Object.entries(itemCount).sort((a, b) => b[1] - a[1]);
    const top5 = sorted.slice(0, 5).map(([name, qty]) => ({
      name,
      quantity: qty,
    }));

    res.json({ success: true, data: top5 });
  } catch (err) {
    res.json({ success: false, message: "Failed to fetch top items" });
  }
};

// Monthly Sales Report
export const monthlySales = async (req, res) => {
  try {
    const now = new Date();
    const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
    const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    lastDay.setHours(23, 59, 59, 999);

    const orders = await orderModel.find({
      date: { $gte: firstDay, $lte: lastDay },
      payment: true,
    });

    const totalSales = orders.reduce((sum, o) => sum + o.amount, 0);
    const totalOrders = orders.length;

    res.json({ success: true, data: { totalSales, totalOrders } });
  } catch (err) {
    res.json({ success: false, message: "Error generating monthly report" });
  }
};
