import express from "express";
import {
  addFeedback,
  getAllFeedback,
  getFeedbackByFoodId
} from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/add", addFeedback);             // Feedback Add
router.get("/list", getAllFeedback);          // Admin: All feedback
router.get("/list/:foodId", getFeedbackByFoodId);  // User: feedback by foodId

export default router;
