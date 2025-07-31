import express from "express";
import { getAllStaff, updateStaffShift, getShiftStaff } from "../controllers/staffController.js";

const router = express.Router();

router.get("/", getAllStaff); // GET /api/staff
router.put("/:id/shift", updateStaffShift); // PUT /api/staff/:id/shift
router.get("/shift", getShiftStaff); // GET /api/staff/shift

export default router;
