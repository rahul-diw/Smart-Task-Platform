import express from "express";
import { registerUser, loginUser, refreshTokenHandler } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh-token", refreshTokenHandler);


export default router; 