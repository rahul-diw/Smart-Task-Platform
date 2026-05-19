"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import { getProjects, createProject, deleteProject, updateProject} from "@/services/api";

export default function WorkspacePage({ params }) {
  // ✅ FIX: unwrap params
  const resolvedParams = use(params);
  const workspaceId = resolvedParams.id;

  const [name, setName] = useState("");
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState("");

  // ✅ LOAD PROJECTS
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);

        const data = await getProjects(workspaceId);

        setProjects(Array.isArray(data) ? data : data.projects || []);
        setError(null);
      } catch (err) {
        console.error(err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };

    if (workspaceId) loadProjects();
  }, [workspaceId]);

  // ✅ CREATE PROJECT
  const handleCreateProject = async () => {
    if (!name.trim()) return;

    try {
      setCreating(true);

      const newProject = await createProject({
        name: name.trim(),
        workspace: workspaceId, // ✅ FIXED
      });

      if (newProject?._id) {
        setProjects((prev) => [...prev, newProject]);
        setName("");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to create project");
    } finally {
      setCreating(false);
    }
  };

  // ✅ DELETE PROJECT
  const handleDelete = async (id) => {
    try {
      await deleteProject(id);

      setProjects((prev) => prev.filter((project) => project._id !== id));
    } catch (err) {
      console.error(err);
      setError("Delete failed");
    }
  };

  // ✅ UPDATE PROJECT
  const handleUpdate = async (id) => {
    try {
      const updated = await updateProject(id, editName);

      setProjects((prev) =>
        prev.map((project) => (project._id === id ? updated : project))
      );

      setEditingId(null);
    } catch (err) {
      console.error(err);
      setError("Update failed");
    }
  };

  // ✅ LOADING UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b1a] flex items-center justify-center text-white">
        Loading projects...
      </div>
    );
  }

  return (
  <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#0f172a] to-[#020617] p-10 text-white">
    <div className="max-w-7xl mx-auto">

      {/* BACK */}
      <button
        onClick={() => (window.location.href = "/workspaces")}
        className="mb-6 text-purple-400 hover:text-purple-300 transition"
      >
        ← Back to Workspaces
      </button>

      {/* ERROR */}
      {error && (
        <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-300">
          {error}
        </div>
      )}

      {/* CREATE BOX */}
      <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 mb-8 border border-white/10 shadow-xl">
        <h2 className="text-xl font-semibold mb-4">Create New Project</h2>

        <div className="flex gap-3">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter project name"
            className="bg-white/10 border border-white/20 p-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-purple-500"
          />

          <button
            onClick={handleCreateProject}
            className="bg-gradient-to-r from-purple-500 to-pink-500 px-6 py-2 rounded-xl font-semibold hover:scale-105 transition shadow-lg"
          >
            {creating ? "Creating..." : "Add"}
          </button>
        </div>
      </div>

      {/* EMPTY */}
      {projects.length === 0 ? (
        <div className="text-center text-gray-400 py-20">
          No projects yet 🚀
        </div>
      ) : (
        <>
          <h2 className="text-xl font-semibold mb-6">
            Projects ({projects.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

            {projects.map((p) => (
              <div
                key={p._id}
                className="relative bg-gradient-to-br from-white/10 to-white/5 p-6 rounded-2xl border border-white/10 hover:border-purple-500/40 hover:scale-105 transition duration-300 cursor-pointer shadow-lg hover:shadow-purple-500/10"
              >

                {/* EDIT */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setEditingId(p._id);
                    setEditName(p.name);
                  }}
                  className="absolute top-2 right-8 text-blue-400"
                >
                  ✏️
                </button>

                {/* DELETE */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(p._id);
                  }}
                  className="absolute top-2 right-2 text-red-400 hover:text-red-600"
                >
                  ✖
                </button>

                {/* CONTENT */}
                <div
                  onClick={() =>
                    (window.location.href = `/project/${p._id}`)
                  }
                >
                  <div className="text-purple-400 text-sm mb-2">
                    📁 Project
                  </div>

                  {editingId === p._id ? (
                    <>
                      <input
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        className="bg-white/10 p-2 rounded w-full text-white"
                      />

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdate(p._id);
                        }}
                        className="mt-2 text-green-400 text-sm"
                      >
                        Save
                      </button>
                    </>
                  ) : (
                    <h2 className="text-lg font-semibold">
                      {p.name}
                    </h2>
                  )}

                  <p className="text-xs text-gray-400 mt-2">
                    Click to open project
                  </p>
                </div>

              </div>
            ))}

          </div>
        </>
      )}
    </div>
  </div>
);
}