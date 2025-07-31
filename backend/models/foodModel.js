import mongoose from "mongoose";

const foodSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
  category: String,
  image: String,
  available: {
    type: Boolean,
    default: true,
  },
});

const foodModel = mongoose.model("Food", foodSchema);
export default foodModel;
