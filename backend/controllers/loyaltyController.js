import loyaltyModel from "../models/loyaltyModel.js";
import userModel from "../models/userModel.js";

// Add points when order is placed
export const addPoints = async (req, res) => {
  try {
    const { email, amount } = req.body;
    const earned = Math.floor(amount / 100); // Every 100 = 1 point

    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    let record = await loyaltyModel.findOne({ userId: user._id });

    if (record) {
      record.points += earned;
      record.updatedAt = Date.now();
      await record.save();
    } else {
      await loyaltyModel.create({ userId: user._id, points: earned });
    }

    res.json({ success: true, message: "Points added" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to add points" });
  }
};

// Admin: Get all loyalty points with user info
export const getAllLoyalty = async (req, res) => {
  try {
    const records = await loyaltyModel.find()
      .populate({ path: 'userId', select: 'fullName email' })  // এখানে name → fullName
      .sort({ points: -1 });

    const formatted = records.map((entry) => ({
      userName: entry.userId?.fullName || "N/A",  // fullName ব্যবহার করো
      userEmail: entry.userId?.email || "N/A",
      points: entry.points,
      updatedAt: entry.updatedAt,
    }));

    res.json({ success: true, data: formatted });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch points" });
  }
};
