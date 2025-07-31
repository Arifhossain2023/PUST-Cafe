// controllers/reservationController.js

import reservationModel from "../models/reservationModel.js";
import tableModel from "../models/tableModel.js";

// 1️⃣ Send new reservation request
export const sendReservationRequest = async (req, res) => {
  try {
    const { tableId, userInfo } = req.body;

    console.log("Reservation Request:", req.body);

    const table = await tableModel.findById(tableId);
    if (!table) return res.json({ success: false, message: "Table not found" });

    if (table.status === "Reserved") {
      return res.json({ success: false, message: "Table already reserved" });
    }

    const newRequest = await reservationModel.create({
      tableId,
      userInfo,
      status: "Pending",
    });

    res.json({ success: true, message: "Reservation request sent", data: newRequest });
  } catch (err) {
    console.error("Reservation error:", err);
    res.json({ success: false, message: "Failed to send request" });
  }
};

// 2️⃣ Get all reservation requests (for admin)
export const getAllReservationRequests = async (req, res) => {
  try {
    const requests = await reservationModel.find({ status: "Pending" }).populate("tableId");
    res.json({ success: true, data: requests });
  } catch (err) {
    res.json({ success: false, message: "Error fetching requests" });
  }
};

// 3️⃣ Approve a reservation request
export const approveReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationModel.findById(id);
    if (!reservation) return res.json({ success: false, message: "Request not found" });

    reservation.status = "Approved";
    await reservation.save();

    await tableModel.findByIdAndUpdate(reservation.tableId, { status: "Reserved" });

    const io = req.app.get("io");
    io.emit("reservation_approved", { tableId: reservation.tableId });

    res.json({ success: true, message: "Reservation approved" });
  } catch (err) {
    res.json({ success: false, message: "Approval failed" });
  }
};

// 4️⃣ Reject a reservation request
export const rejectReservation = async (req, res) => {
  try {
    const { id } = req.params;
    const reservation = await reservationModel.findById(id);
    if (!reservation) return res.json({ success: false, message: "Request not found" });

    reservation.status = "Rejected";
    await reservation.save();

    const io = req.app.get("io");
    io.emit("reservation_rejected", { tableId: reservation.tableId });

    res.json({ success: true, message: "Reservation rejected" });
  } catch (err) {
    res.json({ success: false, message: "Rejection failed" });
  }
};

// 5️⃣ Check reservation status for a specific table
export const getTableReservationStatus = async (req, res) => {
  try {
    const { tableId } = req.params;
    const reservation = await reservationModel.findOne({ tableId, status: "Pending" });
    if (!reservation) return res.json({ success: true, hasRequest: false });

    res.json({ success: true, hasRequest: true, data: reservation });
  } catch (err) {
    res.json({ success: false, message: "Error checking reservation" });
  }
};

// 6️⃣ ✅ NEW: Get all tables with pending reservationRequest
export const listTablesWithReservation = async (req, res) => {
  try {
    const tables = await tableModel.find();

    const enrichedTables = await Promise.all(
      tables.map(async (table) => {
        const reservation = await reservationModel.findOne({
          tableId: table._id,
          status: "Pending"
        });

        return {
          ...table.toObject(),
          reservationRequest: reservation || null
        };
      })
    );

    res.json({ success: true, data: enrichedTables });
  } catch (err) {
    console.error("Error loading tables:", err);
    res.status(500).json({ success: false, message: "Error loading tables" });
  }
};
