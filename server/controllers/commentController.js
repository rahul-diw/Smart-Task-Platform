import Comment from "../models/Comment.js";
import { logActivity } from "./activityController.js";

export const addComment = async (req, res) => {
  try {
    const comment = await Comment.create({
      text: req.body.text,
      task: req.body.taskId,
      user: req.user._id,
    });

    await logActivity(
      "commented on task",
      req.body.taskId,
      req.user._id
    );

    const populated = await comment.populate("user", "name");

    // 🔥 REALTIME COMMENT
    global.io.emit("newComment", populated);

    // 🔔 🔥 FIXED NOTIFICATION
    global.io.emit("notification", {
      message: `${populated.user.name} commented on task`,
    });

    res.status(201).json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET COMMENTS
export const getComments = async (req, res) => {
  try {
    const comments = await Comment.find({
      task: req.params.taskId,
    }).populate("user", "name");

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
