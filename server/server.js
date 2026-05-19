import app from "./app.js";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import { Server } from "socket.io";
import commentRoutes from "./routes/commentRoutes.js";
import activityRoutes from "./routes/activityRoutes.js";
import path from "path";
import express from "express";
import userRoutes from "./routes/userRoutes.js";

dotenv.config();

// CORS
app.use(cors({ origin: "http://localhost:3000", credentials: true }));

// Routes
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/users", userRoutes);  
app.use("/uploads", express.static("uploads"));

const PORT = process.env.PORT || 5000;

// DB connect
connectDB();

// 🔥 IMPORTANT: app.listen ko variable me store karo
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
  },
});

global.io = io;

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("joinProject", (projectId) => {
    socket.join(projectId);
    console.log("Joined room:", projectId);
  });
});
