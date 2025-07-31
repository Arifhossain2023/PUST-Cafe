// ✅ inventoryRoute.js
import express from 'express';
import {
  addIngredient,
  getInventory,
  deleteIngredient,
  updateIngredient,
  useIngredients
} from '../controllers/inventoryController.js';

const router = express.Router();

// ✅ Get full inventory list
router.get('/list', getInventory);

// ✅ Add new or update quantity
router.post('/add', addIngredient);

// ✅ Delete an item
router.post('/delete', deleteIngredient);

// ✅ Edit/update item
router.put('/update', updateIngredient);

// ✅ Use ingredients from kitchen panel
router.post('/use', useIngredients);

export default router;
