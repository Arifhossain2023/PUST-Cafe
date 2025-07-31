import express from "express";
import multer from "multer";
import { addFood, listFood, removeFood, toggleAvailability } from "../controllers/foodController.js";

const foodRouter = express.Router();

// image upload setup
const storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}${file.originalname}`);
  },
});
const upload = multer({ storage: storage });

foodRouter.post("/add", upload.single("image"), addFood);
foodRouter.get("/list", listFood);
foodRouter.post("/remove", removeFood);
foodRouter.post("/toggleAvailability", toggleAvailability);

export default foodRouter;
