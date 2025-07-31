// controllers/tableController.js

import tableModel from "../models/tableModel.js";
import orderModel from "../models/orderModel.js";
import reservationModel from "../models/reservationModel.js"; // নতুন ইমপোর্ট

// ✅ একক table তৈরি
export const createTable = async (req, res) => {
  try {
    const { number } = req.body;
    const exists = await tableModel.findOne({ number });
    if (exists) return res.json({ success: false, message: "Table already exists" });

    await tableModel.create({ number });
    res.json({ success: true, message: "Table created" });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ সব টেবিল list করা (order count ও reservationRequest সহ)
export const getTables = async (req, res) => {
  try {
    const tables = await tableModel.find();

    const tablesWithDetails = await Promise.all(
      tables.map(async (table) => {
        const orderCount = await orderModel.countDocuments({ tableId: table._id });

        // Pending reservation খোঁজা
        const reservation = await reservationModel.findOne({
          tableId: table._id,
          status: "Pending",
        });

        return {
          _id: table._id,
          number: table.number,
          status: table.status,
          orderCount,
          reservationRequest: reservation || null,
        };
      })
    );

    res.json({ success: true, data: tablesWithDetails });
  } catch (err) {
    console.error("getTables error:", err);
    res.json({ success: false, message: "Error fetching tables" });
  }
};

// ✅ টেবিলের স্টেটাস update
export const updateTableStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const { id } = req.params;
    await tableModel.findByIdAndUpdate(id, { status });
    res.json({ success: true, message: "Table updated" });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ একসাথে ২০ টা টেবিল তৈরি
export const seedTables = async (req, res) => {
  try {
    const tables = [];
    for (let i = 1; i <= 20; i++) {
      const exists = await tableModel.findOne({ number: i });
      if (!exists) {
        tables.push({ number: i });
      }
    }
    if (tables.length > 0) {
      await tableModel.insertMany(tables);
    }
    res.json({ success: true, message: "Tables created (1–20 if not exists)" });
  } catch (err) {
    res.json({ success: false, message: "Error creating tables" });
  }
};

// ✅ টেবিলের স্ট্যাটিসটিক্স (idle time এবং total orders)
export const getTableStats = async (req, res) => {
  try {
    const orders = await orderModel.find({}, 'tableId date').populate('tableId');

    const stats = {};

    for (let order of orders) {
      const tableNumber = order.tableId?.number;
      if (!tableNumber) continue;

      if (!stats[tableNumber]) {
        stats[tableNumber] = {
          totalOrders: 0,
          lastUsed: order.date,
        };
      }

      stats[tableNumber].totalOrders += 1;

      // সর্বশেষ ব্যবহার update
      if (order.date > stats[tableNumber].lastUsed) {
        stats[tableNumber].lastUsed = order.date;
      }
    }

    // idle time হিসাব করো (মিনিটে)
    const now = new Date();
    Object.keys(stats).forEach((key) => {
      const lastUsed = stats[key].lastUsed;
      const idleTime = Math.floor((now - lastUsed) / (1000 * 60)); // মিনিটে
      stats[key].totalIdleTime = idleTime;
      delete stats[key].lastUsed;
    });

    res.json({ success: true, data: stats });
  } catch (err) {
    res.json({ success: false, message: "Error calculating stats" });
  }
};
