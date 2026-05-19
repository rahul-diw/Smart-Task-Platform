    import Activity from "../models/Activity.js";

    export const logActivity = async (action, taskId, userId) => {
      try {
        const activity = await Activity.create({
          action,
          task: taskId,
          user: userId,
        });

        const populated = await activity.populate("user", "name");

        global.io.emit("activity", populated); // 🔥 realtime

      } catch (err) {
        console.log("Activity error:", err.message);
      }
    };

  export const getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};