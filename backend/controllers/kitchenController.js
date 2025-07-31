import Kitchen from "../models/kitchenModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerKitchen = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existing = await Kitchen.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Kitchen staff already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const newKitchen = new Kitchen({ name, email, password: hashed });
    await newKitchen.save();

    const token = jwt.sign({ id: newKitchen._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(201).json({
      message: "Registered",
      token,
      kitchen: {
        id: newKitchen._id,
        name: newKitchen.name,
        email: newKitchen.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginKitchen = async (req, res) => {
  try {
    const { email, password } = req.body;

    const kitchen = await Kitchen.findOne({ email });
    if (!kitchen) {
      return res.status(404).json({ message: "Kitchen user not found" });
    }

    const isMatch = await bcrypt.compare(password, kitchen.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ id: kitchen._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful",
      token,
      kitchen: {
        id: kitchen._id,
        name: kitchen.name,
        email: kitchen.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
