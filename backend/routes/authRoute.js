import express from "express";
import { registerAuth, loginAuth } from "../controllers/authController.js";
import upload from "../middleware/multer.js"; // ✅ শুধু একবার multer import

const router = express.Router();

// ✅ Registration with Image Upload
router.post("/register", upload.single("image"), registerAuth);

// ✅ Login
router.post("/login", loginAuth);

export default router;
