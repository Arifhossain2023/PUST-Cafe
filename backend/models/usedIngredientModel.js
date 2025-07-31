// models/usedIngredientModel.js
import mongoose from "mongoose";

const usedIngredientSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "orders",
  },
  usedItems: [
    {
      name: { type: String, required: true },
      quantity: { type: Number, required: true },
    },
  ],
});

const usedIngredientModel = mongoose.models.usedingredient || mongoose.model("usedingredient", usedIngredientSchema);

export default usedIngredientModel;
