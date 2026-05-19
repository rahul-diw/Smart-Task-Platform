import express from "express";
import User from "../models/User.js";
import protect from "../middleware/authMiddleware.js";
import upload from "../middleware/upload.js";

import {
  getMe,
  uploadProfilePic,
  removeProfilePic,
} from "../controllers/userController.js";

const router = express.Router();

router.get("/me", protect, getMe);

router.put(
  "/profile-photo",
  protect,
  upload.single("profilePic"),
  uploadProfilePic
);

router.delete(
  "/profile-photo",
  protect,
  removeProfilePic
);

router.get("/", protect, async (req, res) => {
  try {
    const users = await User.find().select("_id name email");
    res.json(users);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

export default router;