import express from 'express';
import {
  dailySales,
  topItems,
  monthlySales,
} from '../controllers/reportController.js';

const router = express.Router();

router.get('/daily-sales', dailySales);
router.get('/top-items', topItems);
router.get('/monthly-sales', monthlySales); // Monthly report

export default router;
