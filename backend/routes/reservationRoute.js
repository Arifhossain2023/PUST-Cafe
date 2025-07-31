import express from "express";
import authMiddleware, { authorizeRoles } from "../middleware/auth.js";
import {
  sendReservationRequest,
  getAllReservationRequests,
  approveReservation,
  rejectReservation,
  getTableReservationStatus,
} from "../controllers/reservationController.js";

const router = express.Router();

router.post("/send", authMiddleware, sendReservationRequest);
router.get("/requests", authMiddleware, authorizeRoles("admin"), getAllReservationRequests);
router.put("/approve/:id", authMiddleware, authorizeRoles("admin"), approveReservation);
router.put("/reject/:id", authMiddleware, authorizeRoles("admin"), rejectReservation);
router.get("/status/:tableId", getTableReservationStatus);

export default router;
