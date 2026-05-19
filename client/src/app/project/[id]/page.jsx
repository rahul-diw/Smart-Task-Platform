"use client";

import toast from "react-hot-toast";
import { useEffect, useState, use } from "react";
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  getUsers,
  deleteTask,
} from "@/services/api";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { io } from "socket.io-client";
import { useRef } from "react";
import { addComment, getComments } from "@/services/api";
import { getActivities } from "@/services/api";

export default function ProjectPage({ params }) {
  const resolvedParams = use(params);
  const id = resolvedParams.id;

  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [files, setFiles] = useState([]);
  const [priority, setPriority] = useState("low");
  const [users, setUsers] = useState([]);
  const [assignedTo, setAssignedTo] = useState("");
  const [selectedTask, setSelectedTask] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [showNotif, setShowNotif] = useState(false);
  const [showActivity, setShowActivity] = useState(false);
  const [search, setSearch] = useState("");
  const [filterPriority, setFilterPriority] = useState("all");

  const unreadCount = notifications.filter((n) => !n.read).length;

  const socketRef = useRef(null);

  const [modalTitle, setModalTitle] = useState("");
  const [modalPriority, setModalPriority] = useState("low");
  const [modalDueDate, setModalDueDate] = useState("");
  const alertedTasks = new Set();

  const checkDeadlines = (tasks) => {
    const now = new Date();

    tasks.forEach((task) => {
      if (!task.dueDate) return;

      const due = new Date(task.dueDate);
      const diff = (due - now) / (1000 * 60 * 60);

      if (diff < 0) {
        console.log(`❌ Overdue: ${task.title}`);
      }

      if (diff > 0 && diff < 2 && !alertedTasks.has(task._id)) {
        alert(`⏰ Task nearing deadline: ${task.title}`);
        alertedTasks.add(task._id);
      }
    });
  };

  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleAddComment = async () => {
    const comment = await addComment(newComment, selectedTask._id);

    setComments((prev) => [...prev, comment]);
    setNewComment("");
    toast.success("Comment added 💬");
  };

  // 🔥 LOAD TASKS
  useEffect(() => {
    const loadTasks = async () => {
      setLoading(true);
      const data = await getTasks(id);
      setTasks(Array.isArray(data) ? data : data.tasks || []);
      setLoading(false);
    };
    if (id) loadTasks();
  }, [id]);

  // 🔥 LOAD USERS
  useEffect(() => {
    const loadUsers = async () => {
      const data = await getUsers();
      setUsers(data);
    };
    loadUsers();
  }, []);

  useEffect(() => {
    getActivities().then(setActivities);
  }, []);

  useEffect(() => {
    if (selectedTask) {
      getComments(selectedTask._id).then(setComments);
    }
  }, [selectedTask]);

  useEffect(() => {
    if (tasks.length) {
      checkDeadlines(tasks);
    }
  }, [tasks]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkDeadlines(tasks);
    }, 60000);

    return () => clearInterval(interval);
  }, [tasks]);

  // 🔥 SOCKET
  useEffect(() => {
    socketRef.current = io("http://localhost:5000");

    socketRef.current.on("connect", () => {
      console.log("Socket connected:", socketRef.current.id);
      socketRef.current.emit("joinProject", id);
    });

    socketRef.current.on("taskCreated", (task) => {
      if (task.project !== id) return;

      setTasks((prev) => {
        const exists = prev.find((t) => t._id === task._id);
        return exists ? prev : [...prev, task];
      });
    });

    socketRef.current.on("taskUpdated", (updatedTask) => {
      setTasks((prev) =>
        prev.map((t) =>
          t._id === updatedTask._id ? { ...t, ...updatedTask } : t,
        ),
      );
    });

    socketRef.current.on("taskDeleted", (taskId) => {
      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    });

    socketRef.current.on("newComment", (comment) => {
      if (comment.task === selectedTask?._id) {
        setComments((prev) => [...prev, comment]);
      }
    });

    socketRef.current.on("activity", (act) => {
      setActivities((prev) => [act, ...prev]);
    });

    socketRef.current.on("notification", (notif) => {
      console.log("🔔", notif);

      setNotifications((prev) => [{ ...notif, read: false }, ...prev]);
    });

    return () => socketRef.current.disconnect();
  }, [id]);

  useEffect(() => {
    const closeAll = () => {
      setShowNotif(false);
    };

    window.addEventListener("click", closeAll);

    return () => window.removeEventListener("click", closeAll);
  }, []);

  // 🔥 FILL MODAL
  useEffect(() => {
    if (selectedTask) {
      setModalTitle(selectedTask.title || "");
      setModalPriority(selectedTask.priority || "low");
      setModalDueDate(selectedTask.dueDate?.slice(0, 10) || "");
      setAssignedTo(selectedTask.assignedTo?._id || "");
    }
  }, [selectedTask]);

  // 🔥 CREATE TASK
  const handleAddTask = async () => {
    try {
      const formData = new FormData();

      console.log("TITLE:", title);
      console.log("PROJECT ID:", id);
      console.log("FILES:", files);

      formData.append("title", title);

      formData.append("priority", priority);

      formData.append("dueDate", dueDate);

      formData.append("assignedTo", assignedTo);

      formData.append("project", id);

      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }

      files.forEach((file) => {
        formData.append("attachments", file);
      });

      console.log("SENDING TASK:", formData);

      await createTask(formData);
      toast.success("Task created");

      loadTasks();

      setTitle("");
      setDueDate("");
      setAssignedTo("");
      setPriority("low");
      setFiles([]);
    } catch (err) {
      console.log(err);

      toast.error("Something went wrong");
    }
  };

  // 🔥 GROUP
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesPriority =
      filterPriority === "all" ? true : task.priority === filterPriority;

    return matchesSearch && matchesPriority;
  });

  const columns = {
    pending: filteredTasks.filter((t) => t.status === "pending"),

    "in-progress": filteredTasks.filter((t) => t.status === "in-progress"),

    completed: filteredTasks.filter((t) => t.status === "completed"),
  };

  // 🔥 DRAG
  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const { source, destination } = result;

    if (source.droppableId === destination.droppableId) return;

    const task = columns[source.droppableId][source.index];

    const updated = tasks.map((t) =>
      t._id === task._id ? { ...t, status: destination.droppableId } : t,
    );

    setTasks(updated);
    await updateTaskStatus(task._id, destination.droppableId);
  };

  // 🔥 DELETE
  const handleDeleteTask = async (taskId) => {
    const confirmDelete = confirm("Delete this task?");

    if (!confirmDelete) return;

    try {
      await deleteTask(taskId);
      toast.success("Task deleted 🗑");

      setTasks((prev) => prev.filter((t) => t._id !== taskId));
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b1a] flex items-center justify-center text-white text-2xl font-semibold">
        Loading workspace...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0b0b1a] via-[#111827] to-[#1e1b4b] p-6 md:p-10 text-white">
      {/* 🔝 TOP RIGHT CONTROLS */}
      {!showActivity && (
        <div className="fixed top-5 right-5 flex items-center gap-3 z-[10000] flex-wrap">
          {/* 📋 ACTIVITY BUTTON */}
          <button
            onClick={() => {
              setShowActivity(true);
              setShowNotif(false);
            }}
            className="bg-[#1f2937] hover:bg-[#374151] px-4 py-2 rounded-xl text-sm border border-white/10 transition"
          >
            📋 Activity
          </button>

          {/* 🔔 BELL */}
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowNotif(!showNotif);
                setShowActivity(false);
              }}
              className="text-2xl"
            >
              🔔
            </button>

            {/* 🔴 UNREAD */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] px-1.5 rounded-full">
                {unreadCount}
              </span>
            )}

            {/* 🔔 DROPDOWN */}
            {showNotif && (
              <div
                className="absolute right-0 mt-3 w-72 bg-[#111827] border border-white/10 rounded-2xl shadow-2xl p-4"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold">Notifications</h3>

                  <button
                    onClick={() => setShowNotif(false)}
                    className="text-gray-400 hover:text-white"
                  >
                    ✕
                  </button>
                </div>

                {notifications.length === 0 ? (
                  <p className="text-sm text-gray-400">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <div
                      key={i}
                      className="bg-white/5 p-3 rounded-xl mb-2 text-sm"
                    >
                      {n.message}
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* SEARCH + FILTER */}
      <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
        {/* LEFT */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* SEARCH */}
          <div className="relative">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search tasks..."
              className="
          w-[340px]
          bg-white/5
          border border-white/10
          rounded-2xl
          pl-12
          pr-4
          py-3
          text-white
          placeholder:text-gray-400
          outline-none
          backdrop-blur-xl
          focus:border-purple-500
          focus:ring-2
          focus:ring-purple-500/20
          transition-all
        "
            />

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              🔍
            </span>
          </div>

          {/* FILTER */}
          <select
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="
        bg-white/5
        border border-white/10
        rounded-2xl
        px-4
        py-3
        text-white
        outline-none
        backdrop-blur-xl
        focus:border-purple-500
      "
          >
            <option value="all">All Priority</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>

      {/* ADD TASK */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Task..."
          className="bg-white/10 border border-white/10 focus:border-purple-500 outline-none p-3 rounded-2xl transition"
        />

        <select
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className="bg-white/10 border border-white/10 focus:border-purple-500 outline-none p-3 rounded-2xl transition"
        >
          <option value="">Assign user</option>
          {users.map((u) => (
            <option key={u._id} value={u._id}>
              {u.name}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="bg-white/10 border border-white/10 focus:border-purple-500 outline-none p-3 rounded-2xl transition"
        />

        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
          className="bg-white/10 border border-white/10 focus:border-purple-500 outline-none p-3 rounded-2xl transition"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>

        <label className="bg-white/10 hover:bg-white/20 px-4 py-2 rounded cursor-pointer text-sm border border-white/10 transition">
          📎 Attach Files
          <input
            type="file"
            multiple
            hidden
            onChange={(e) => setFiles([...e.target.files])}
          />
        </label>

        {files.length > 0 && (
          <p className="text-xs text-gray-400 mt-1">
            {files.length} file(s) selected
          </p>
        )}

        <button
          onClick={handleAddTask}
          className="bg-gradient-to-r from-purple-500 to-indigo-500 hover:scale-105 transition-all duration-300 px-6 py-3 rounded-2xl font-semibold shadow-lg shadow-purple-500/30"
        >
          Add
        </button>
      </div>

      {/* BOARD */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex gap-6 overflow-x-auto pb-4">
          {Object.entries(columns).map(([key, col]) => (
            <Droppable droppableId={key} key={key}>
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className="bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-4 rounded-3xl min-w-[320px] w-[320px] min-h-[400px] flex-shrink-0 transition"
                >
                  <h2 className="mb-5 capitalize text-xl font-bold tracking-wide">
                    {key}
                  </h2>

                  {col.length === 0 && (
                    <div className="text-center text-gray-500 text-sm mt-10 border border-dashed border-white/10 rounded-2xl p-6">
                      No tasks here 🚀
                    </div>
                  )}

                  {col.map((task, index) => (
                    <Draggable
                      key={task._id}
                      draggableId={task._id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="bg-white/5 backdrop-blur-xl border border-white/10 hover:border-purple-500/40 hover:bg-white/10 p-4 rounded-3xl mb-4 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 shadow-lg hover:shadow-[0_12px_35px_rgba(139,92,246,0.25)] cursor-pointer"
                        >
                          {/* DRAG */}
                          <div
                            {...provided.dragHandleProps}
                            className="cursor-grab text-xs text-gray-400 mb-1"
                          >
                            ⠿ Drag
                          </div>

                          {/* CLICK */}
                          <div
                            onClick={() => setSelectedTask(task)}
                            className="cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-3">
                              <div>
                                <p
                                  className={`font-semibold text-base ${
                                    task.dueDate &&
                                    new Date(task.dueDate) < new Date()
                                      ? "text-red-400"
                                      : "text-white"
                                  }`}
                                >
                                  {task.title}
                                </p>

                                {task.dueDate && (
                                  <p className="text-xs text-gray-500 mt-1">
                                    📅{" "}
                                    {new Date(
                                      task.dueDate,
                                    ).toLocaleDateString()}
                                  </p>
                                )}
                              </div>

                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteTask(task._id);
                                }}
                                className="text-red-400 hover:text-red-300 text-sm"
                              >
                                🗑
                              </button>
                            </div>

                            {task.assignedTo && (
                              <p className="text-xs text-gray-400">
                                👤 {task.assignedTo.name}
                              </p>
                            )}

                            {task.attachments?.length > 0 && (
                              <div className="mt-3 space-y-1">
                                {task.attachments.map((file, index) => (
                                  <a
                                    key={index}
                                    href={`http://localhost:5000/uploads/${file}`}
                                    target="_blank"
                                    className="block text-xs text-blue-400 hover:underline"
                                  >
                                    📎 {file}
                                  </a>
                                ))}
                              </div>
                            )}

                            <span className="text-xs bg-purple-500 px-2 rounded">
                              {task.priority}
                            </span>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>

      {/* 📋 ACTIVITY DRAWER */}
      {showActivity && (
        <div
          className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-sm"
          onClick={() => setShowActivity(false)}
        >
          <div
            className="absolute right-0 top-0 w-[380px] h-screen bg-[#111827] border-l border-white/10 shadow-2xl p-5 overflow-y-auto animate-slideIn"
            onClick={(e) => e.stopPropagation()}
          >
            {/* HEADER */}
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-xl font-semibold">📋 Activity</h2>

              <button
                onClick={() => setShowActivity(false)}
                className="text-gray-400 hover:text-white text-xl"
              >
                ✕
              </button>
            </div>

            {/* LIST */}
            <div className="space-y-3">
              {activities.length === 0 ? (
                <p className="text-sm text-gray-400">No activity yet</p>
              ) : (
                activities.map((a) => (
                  <div
                    key={a._id}
                    className="bg-white/5 border border-white/5 p-4 rounded-2xl"
                  >
                    <p className="text-sm leading-relaxed">
                      <span className="font-semibold text-purple-400">
                        {a.user?.name || "User"}
                      </span>{" "}
                      {a.action}
                    </p>

                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(a.createdAt).toLocaleString()}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* 🔥 MODAL */}
      {selectedTask && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/60 z-50">
          <div className="bg-[#111827]/95 backdrop-blur-xl border border-white/10 p-6 rounded-3xl w-96 shadow-2xl animate-[fadeIn_.25s_ease]">
            <input
              value={modalTitle}
              onChange={(e) => setModalTitle(e.target.value)}
              className="w-full mb-3 p-2 bg-white/10 rounded"
            />

            <select
              value={assignedTo}
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full mb-3 p-2 bg-white/10 rounded"
            >
              <option value="">Select user</option>
              {users.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.name}
                </option>
              ))}
            </select>

            <select
              value={modalPriority}
              onChange={(e) => setModalPriority(e.target.value)}
              className="w-full mb-3 p-2 bg-white/10 rounded"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <input
              type="date"
              value={modalDueDate}
              onChange={(e) => setModalDueDate(e.target.value)}
              className="w-full mb-4 p-2 bg-white/10 rounded"
            />

            <div className="mt-4">
              <h3 className="text-sm mb-2">Comments</h3>

              {comments.map((c) => (
                <div key={c._id} className="text-sm mb-1">
                  <b>{c.user.name}:</b> {c.text}
                </div>
              ))}

              <div className="flex gap-2 mt-2">
                <input
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  className="flex-1 p-2 bg-white/10 rounded"
                  placeholder="Write comment..."
                />
                <button
                  onClick={handleAddComment}
                  className="bg-blue-500 px-3 rounded"
                >
                  Send
                </button>
              </div>
            </div>

            <button
              onClick={async () => {
                const updated = await updateTask(selectedTask._id, {
                  title: modalTitle,
                  priority: modalPriority,
                  dueDate: modalDueDate,
                  assignedTo,
                });

                setTasks((prev) =>
                  prev.map((t) =>
                    t._id === selectedTask._id ? { ...t, ...updated } : t,
                  ),
                );

                setSelectedTask(null);
              }}
              className="w-full bg-purple-500 py-2 rounded"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
