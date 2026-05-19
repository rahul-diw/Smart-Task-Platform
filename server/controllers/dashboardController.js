import Workspace from "../models/Workspace.js";
import Project from "../models/Project.js";
import Task from "../models/Task.js";

export const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    // WORKSPACES
    const workspaces = await Workspace.countDocuments({
      user: userId,
    });

    // PROJECTS
    const projects = await Project.countDocuments({
      createdBy: userId,
    });

    // TASKS
    const totalTasks = await Task.countDocuments({
      createdBy: userId,
    });

    const pendingTasks = await Task.countDocuments({
      createdBy: userId,
      status: "pending",
    });

    const completedTasks = await Task.countDocuments({
      createdBy: userId,
      status: "completed",
    });

    const inProgressTasks = await Task.countDocuments({
      createdBy: userId,
      status: "in-progress",
    });

    res.json({
      workspaces,
      projects,
      totalTasks,
      pendingTasks,
      completedTasks,
      inProgressTasks,
    });

  } catch (err) {
    res.status(500).json({
      message: err.message,
    });
  }
};