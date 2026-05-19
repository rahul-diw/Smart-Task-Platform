import Workspace from "../models/Workspace.js";

// create workspace
export const createWorkspace = async (req, res) => {
  try {

    const workspace = await Workspace.create({
      name: req.body.name,
      owner: req.user._id,
      members: [req.user._id]
    });

    res.status(201).json(workspace);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all workspaces of user
export const getWorkspaces = async (req, res) => {
  try {

    const workspaces = await Workspace.find({
      members: req.user._id
    });

    res.json(workspaces);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};