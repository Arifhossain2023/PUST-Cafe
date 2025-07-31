// ✅ inventoryController.js
import inventoryModel from "../models/inventoryModel.js";
import usedIngredientModel from "../models/usedIngredientModel.js";

// ✅ Add or update quantity of ingredient
export const addIngredient = async (req, res) => {
  try {
    const { name, quantity } = req.body;
    const existing = await inventoryModel.findOne({ name });

    if (existing) {
      existing.quantity += Number(quantity);
      await existing.save();
    } else {
      await inventoryModel.create({ name, quantity });
    }

    res.json({ success: true, message: "Ingredient added/updated" });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Get all ingredients
export const getInventory = async (req, res) => {
  try {
    const items = await inventoryModel.find();
    res.json({ success: true, data: items });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Delete ingredient
export const deleteIngredient = async (req, res) => {
  try {
    const { id } = req.body;
    await inventoryModel.findByIdAndDelete(id);
    res.json({ success: true, message: "Ingredient removed" });
  } catch (err) {
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Update ingredient
export const updateIngredient = async (req, res) => {
  try {
    const { id, name, quantity } = req.body;
    const item = await inventoryModel.findById(id);
    if (!item) {
      return res.status(404).json({ success: false, message: "Item not found" });
    }

    item.name = name;
    item.quantity = quantity;
    await item.save();

    res.json({ success: true, message: "Ingredient updated", data: item });
  } catch (err) {
    res.json({ success: false, message: "Error updating ingredient" });
  }
};

// ✅ Use ingredients from kitchen (handle both Ready and Edit mode)
export const useIngredients = async (req, res) => {
  try {
    const { orderId, usedItems } = req.body;

    if (!usedItems || !Array.isArray(usedItems) || !orderId) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }

    // 🔁 Reverse old ingredients if this order was previously submitted
    const existingUsage = await usedIngredientModel.findOne({ orderId });

    if (existingUsage) {
      for (const oldItem of existingUsage.usedItems) {
        const inv = await inventoryModel.findOne({ name: oldItem.name });
        if (inv) {
          inv.quantity += Number(oldItem.quantity);
          await inv.save();
        }
      }
    }

    // ➖ Apply new usage
    for (const item of usedItems) {
      const inv = await inventoryModel.findOne({ name: item.name });
      if (inv) {
        inv.quantity -= Number(item.quantity);
        if (inv.quantity < 0) inv.quantity = 0;
        await inv.save();
      }
    }

    // 💾 Save or update usage
    if (existingUsage) {
      existingUsage.usedItems = usedItems;
      await existingUsage.save();
    } else {
      await usedIngredientModel.create({ orderId, usedItems });
    }

    res.json({ success: true, message: "Inventory updated successfully" });
  } catch (err) {
    console.error("Error using ingredients:", err);
    res.status(500).json({ success: false, message: "Failed to update inventory" });
  }
};
