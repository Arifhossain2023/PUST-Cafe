import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order"
  },
  foodId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Food",
    required: true
  },
  rating: {
    type: Number,
    required: true
  },
  comment: {
    type: String
  },
  date: {
    type: Date,
    default: Date.now
  }
});

const feedbackModel = mongoose.model("Feedback", feedbackSchema);
export default feedbackModel;
