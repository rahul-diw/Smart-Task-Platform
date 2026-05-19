import Task from "../models/Task.js";
import { logActivity } from "../controllers/activityController.js";

// 🔥 CREATE TASK
export const createTask = async (req, res) => {
  try {
  const files = req.files
    ? req.files.map((file) => file.filename)
    : [];

  const task = await Task.create({
    title: req.body.title, 
    priority: req.body.priority,
    dueDate: req.body.dueDate,
    assignedTo: req.body.assignedTo,
    project: req.body.project,
    createdBy: req.user._id,
    attachments: files, 
  });

    const populatedTask = await task.populate("assignedTo", "name email");

    // 🔥 CORRECT EMIT
    global.io.to(task.project.toString()).emit("taskCreated", populatedTask);

    // 🔥 LOG ACTIVITY
    await logActivity("taskCreated", task._id, req.user._id);

    console.log(req.body);
    console.log(req.files);

    res.status(201).json(populatedTask);
  }catch (err) {
  console.log(err);
  res.status(500).json({ message: err.message });
}
};

// 🔥 GET TASKS
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      project: req.params.projectId,
    }).populate("assignedTo", "name email");

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 UPDATE STATUS (DRAG)
export const updateTaskStatus = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    task.status = req.body.status;
    await task.save();

    await logActivity(`moved task to ${task.status}`, task._id, req.user._id);

    // 🔥 REALTIME
    global.io.emit("taskUpdated", task);

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔥 DELETE TASK
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    await Task.findByIdAndDelete(req.params.id);

    global.io.to(task.project.toString()).emit("taskDeleted", task._id);

    res.json({ message: "Task deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// 🔥 UPDATE TASK (MODAL EDIT)
export const updateTask = async (req, res) => {
  try {
    const updates = {};

    if (req.body.title) updates.title = req.body.title;
    if (req.body.priority) updates.priority = req.body.priority;
    if (req.body.dueDate) updates.dueDate = req.body.dueDate;
    if (req.body.assignedTo) updates.assignedTo = req.body.assignedTo;

    const task = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    }).populate("assignedTo", "name email");

    await logActivity(`updated task "${task.title}"`, task._id, req.user._id);

    console.log("🔥 NOTIFICATION EMITTED");

    global.io.to(task.project.toString()).emit("taskUpdated", task);

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
