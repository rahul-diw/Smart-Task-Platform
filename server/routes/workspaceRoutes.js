import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createWorkspace, getWorkspaces } from "../controllers/workspaceController.js";

const router = express.Router();

router.post("/", protect, createWorkspace);
router.get("/", protect, getWorkspaces);

export default router;