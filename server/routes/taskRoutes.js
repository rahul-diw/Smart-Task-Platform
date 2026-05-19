import express from "express";
import protect from "../middleware/authMiddleware.js";
import { createTask, getTasks } from "../controllers/taskController.js";
import { updateTaskStatus } from "../controllers/taskController.js";
import { deleteTask, updateTask } from "../controllers/taskController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/", protect, upload.array("attachments"), createTask);
router.get("/:projectId", protect, getTasks);
router.put("/:taskId/status", protect, updateTaskStatus);
router.put("/:id/status", protect, updateTaskStatus);
router.delete("/:id", protect, deleteTask);
router.put("/:id", protect, updateTask);

export default router;
