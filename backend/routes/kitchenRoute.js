// ✅ kitchenRoute.js
import express from 'express';
import {
  registerKitchen,
  loginKitchen
} from '../controllers/kitchenController.js';

import {
  listOrders,
  updateStatus
} from '../controllers/orderController.js';

const router = express.Router();

// ✅ Kitchen Authentication Routes
router.post('/register', registerKitchen);
router.post('/login', loginKitchen);

// ✅ Kitchen Order Management
router.get('/orders', listOrders);         // Get all orders for kitchen display
router.post('/order/status', updateStatus); // Update order/item status (e.g., preparing, ready)

export default router;