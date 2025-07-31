import ManualPayment from '../models/ManualPaymentModel.js';
import Order from '../models/orderModel.js';

// GET all manual payments
export const getManualPayments = async (req, res) => {
  try {
    // Debug: log to check DB connection & query
    console.log("Fetching manual payments...");

    const payments = await ManualPayment.find()
      .populate("orderId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: payments });
  } catch (err) {
    console.error("Error in getManualPayments:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


// POST create new manual payment
export const createManualPayment = async (req, res) => {
  try {
    const { orderId, method, phone, txnId } = req.body;

    if (!orderId || !method || !phone || !txnId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Optional: duplicate txnId check for same order
    const existing = await ManualPayment.findOne({ orderId, txnId });
    if (existing) {
      return res.status(400).json({ success: false, message: "Transaction ID already used" });
    }

    const payment = new ManualPayment({
      orderId,
      method,
      phone,
      txnId,
      status: 'Pending'  // শুরুতে Pending রাখো, পরে admin অনুমোদন দেবে
    });

    await payment.save();

    res.status(201).json({ success: true, data: payment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// PATCH approve/reject manual payment status
export const updateManualPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const payment = await ManualPayment.findByIdAndUpdate(id, { status }, { new: true });

    // যদি Approve হয়, তাহলে order payment status update করো
    if (status === 'Approved' && payment?.orderId) {
      await Order.findByIdAndUpdate(payment.orderId, { payment: true });
    }

    res.status(200).json({ success: true, message: "Payment status updated", data: payment });
  } catch (err) {
    res.status(500).json({ success: false, message: "Update failed" });
  }
};
