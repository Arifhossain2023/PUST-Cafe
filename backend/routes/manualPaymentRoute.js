import express from 'express';
import {
  getManualPayments,
  createManualPayment,
  updateManualPaymentStatus
} from '../controllers/manualPaymentController.js';

const router = express.Router();

router.get('/manual', getManualPayments);
router.post('/manual', createManualPayment);       // POST route যোগ করা হলো
router.patch('/manual/:id', updateManualPaymentStatus);

export default router;
