import foodModel from "../models/foodModel.js";
import fs from "fs";

// ✅ Add Food
const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name: req.body.name,
    description: req.body.description,
    price: req.body.price,
    category: req.body.category,
    image: image_filename,
    available: true,
  });

  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    res.json({ success: false, message: "Failed to add food item" });
  }
};

// ✅ List Foods
const listFood = async (req, res) => {
  try {
    const food = await foodModel.find({});
    res.json({ success: true, data: food });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Remove Food
const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "Food Removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

// ✅ Toggle Availability
const toggleAvailability = async (req, res) => {
  const { id, available } = req.body;

  try {
    const food = await foodModel.findById(id);
    if (!food) {
      return res.status(404).json({ success: false, message: "Food not found" });
    }

    food.available = available;
    await food.save();

    // Emit update via socket
    const io = req.app.get("io");
    io.emit("foodAvailabilityUpdated", { id, available });

    res.json({
      success: true,
      message: `Food marked as ${available ? "Available" : "Unavailable"}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error updating availability" });
  }
};

export { addFood, listFood, removeFood, toggleAvailability };
