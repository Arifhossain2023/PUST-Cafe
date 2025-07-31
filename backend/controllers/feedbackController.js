import feedbackModel from "../models/feedbackModel.js";
import loyaltyModel from "../models/loyaltyModel.js";

// Add new feedback and loyalty points
export const addFeedback = async (req, res) => {
  try {
    const { userId, orderId, rating, comment, foodId } = req.body;

    if (!userId || !rating || !foodId) {
      return res.status(400).json({
        success: false,
        message: "UserId, rating, and foodId are required"
      });
    }

    const feedback = new feedbackModel({
      userId,
      orderId,
      foodId,
      rating,
      comment
    });
    await feedback.save();

    // Add loyalty points
    const pointsToAdd = rating * 10;
    let loyalty = await loyaltyModel.findOne({ userId });
    if (!loyalty) {
      loyalty = new loyaltyModel({ userId, points: pointsToAdd });
    } else {
      loyalty.points += pointsToAdd;
    }
    await loyalty.save();

    res.json({ success: true, message: "Feedback submitted and loyalty updated" });
  } catch (error) {
    console.error("Error in addFeedback:", error);
    res.status(500).json({ success: false, message: "Failed to submit feedback" });
  }
};

// Admin: Get all feedbacks with user info
export const getAllFeedback = async (req, res) => {
  try {
    const feedbacks = await feedbackModel
      .find()
      .sort({ date: -1 })
      .populate("userId", "fullName email");  // fullName & email populate করা হচ্ছে

    const formatted = feedbacks.map(fb => ({
      _id: fb._id,
      userName: fb.userId?.fullName || "N/A",  // fullName ব্যবহার করো
      userEmail: fb.userId?.email || "N/A",
      rating: fb.rating,
      comment: fb.comment,
      date: fb.date
    }));

    res.json({ success: true, data: formatted });
  } catch (error) {
    console.error("Error in getAllFeedback:", error);
    res.status(500).json({ success: false, message: "Failed to fetch feedback" });
  }
};

// User: Get feedbacks by foodId
export const getFeedbackByFoodId = async (req, res) => {
  try {
    const { foodId } = req.params;

    const feedbacks = await feedbackModel
      .find({ foodId })
      .sort({ date: -1 })
      .populate("userId", "fullName email");  // fullName & email populate করা হচ্ছে

    res.json({ success: true, data: feedbacks });
  } catch (error) {
    console.error("Error in getFeedbackByFoodId:", error);
    res.status(500).json({ success: false, message: "Failed to fetch feedback for this item" });
  }
};
