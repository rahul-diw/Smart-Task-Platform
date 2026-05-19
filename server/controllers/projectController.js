import Project from "../models/Project.js";


// create project
export const createProject = async (req, res) => {
  try {

    console.log("BODY:", req.body); // 👈 ADD THIS

    const project = await Project.create({
      name: req.body.name,
      workspace: req.body.workspace,
      createdBy: req.user._id
    });

    res.status(201).json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// get projects by workspace
export const getProjects = async (req, res) => {
  try {

    const projects = await Project.find({
      workspace: req.params.workspaceId
    });

    res.json(projects);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    await project.deleteOne();

    res.json({ message: "Project deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateProject = async (req, res) => {
  try {

    const project = await Project.findById(req.params.id);

    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }

    project.name = req.body.name || project.name;

    await project.save();

    res.json(project);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

