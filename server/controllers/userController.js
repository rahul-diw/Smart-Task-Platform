import User from "../models/User.js";


// GET CURRENT USER
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// UPDATE PROFILE PHOTO
export const uploadProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (req.file) {
      user.profilePic = req.file.filename;
    }

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// REMOVE PROFILE PHOTO
export const removeProfilePic = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.profilePic = "";

    await user.save();

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};