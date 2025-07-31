import Auth from "../models/authModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// ✅ Staff Register Controller
export const registerAuth = async (req, res) => {
  try {
    const { name, email, password, role, phone } = req.body;
    const file = req.file;

    // Check if user already exists
    const existing = await Auth.findOne({ email });
    if (existing) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const imagePath = file ? file.filename : "";

    // Create new user
    const newUser = await Auth.create({
      name,
      email,
      password: hashedPassword,
      role,
      phone,
      image: imagePath,
    });

    res.json({
      success: true,
      message: "Registration successful",
      user: newUser,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.json({ success: false, message: "Register failed" });
  }
};

// ✅ Staff Login Controller
export const loginAuth = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find user
    const user = await Auth.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }

    // Compare password
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Respond
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        image: user.image,
      },
    });
  } catch (err) {
    console.error("Login Error:", err);
    res.json({ success: false, message: "Login error" });
  }
};
