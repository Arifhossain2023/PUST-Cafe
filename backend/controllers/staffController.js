import Auth from "../models/authModel.js";

// 1. Staff list fetch (excluding admin)
export const getAllStaff = async (req, res) => {
  try {
    const staffList = await Auth.find({
      role: { $in: ["waiter", "kitchen", "cashier"] },
    }).select("-password");

    res.status(200).json(staffList);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch staff list" });
  }
};

// 2. Shift update controller
export const updateStaffShift = async (req, res) => {
  const { id } = req.params;
  const { shift } = req.body;

  if (!["Morning", "Evening", "None"].includes(shift)) {
    return res.status(400).json({ success: false, message: "Invalid shift value" });
  }

  try {
    const updatedStaff = await Auth.findByIdAndUpdate(
      id,
      { shift },
      { new: true }
    ).select("-password");

    if (!updatedStaff) {
      return res.status(404).json({ success: false, message: "Staff not found" });
    }

    res.json({ success: true, staff: updatedStaff });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 3. Get shift-wise staff list
export const getShiftStaff = async (req, res) => {
  try {
    const staff = await Auth.find({}, "name role shift");
    const morning = staff.filter(s => s.shift === "Morning");
    const evening = staff.filter(s => s.shift === "Evening");

    res.status(200).json({ morning, evening });
  } catch (err) {
    res.status(500).json({ message: "Error fetching shift staff" });
  }
};
