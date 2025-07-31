// ✅ userController.js
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  try {
    const { fullName, phone, email, password, role } = req.body;
    const file = req.file;

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.json({ success: false, message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const image = file ? file.filename : "";

    const newUser = await User.create({
      fullName,
      phone,
      email,
      password: hashedPassword,
      role,
      image,
    });

    res.json({ success: true, user: newUser });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Registration failed" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ success: false, message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.json({ success: false, message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Login error" });
  }
};
