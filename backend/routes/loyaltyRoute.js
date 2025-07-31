import express from "express";
import { addPoints, getAllLoyalty } from "../controllers/loyaltyController.js";

const router = express.Router();

router.post("/add", addPoints);        // User earns points on order
router.get("/list", getAllLoyalty);    // Admin views points list

export default router;
