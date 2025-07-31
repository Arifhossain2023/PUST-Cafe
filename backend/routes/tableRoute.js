import express from 'express';
import {
  createTable,
  getTables,
  updateTableStatus,
  seedTables,
  getTableStats, // ✅ New
} from '../controllers/tableController.js';

const router = express.Router();

router.post("/create", createTable);
router.get("/list", getTables);
router.put("/update/:id", updateTableStatus);
router.get("/seed", seedTables);
router.get("/stats", getTableStats); // ✅ New route

export default router;
