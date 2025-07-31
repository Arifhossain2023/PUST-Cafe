
// ✅ userRoute.js
import express from "express";
import multer from "../middleware/multer.js";
import { registerUser, loginUser } from "../controllers/userController.js";

const router = express.Router();

router.post("/register", multer.single("image"), registerUser);
router.post("/login", loginUser);

export default router;
