import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createProject, getProjects, deleteProject, updateProject } from "../controllers/projectController.js";

const router = express.Router();

router.post("/", protect, createProject);
router.get("/:workspaceId", protect, getProjects);
router.delete("/:id", protect, deleteProject);
router.put("/:id", protect, updateProject);


export default router;