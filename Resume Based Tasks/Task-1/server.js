require('dotenv').config()
const express = require("express");
const connectDB = require("./src/config/db");
const http = require("http");
const { Server } = require("socket.io");
// const Message = require("./src/models/Message");
// const mongoose = require("mongoose");
const cookieParser = require('cookie-parser')
// const roomRoutes = require("./src/routes/roomRoutes");
// const userRoutes = require("./src/routes/userRoutes");
// const messageRoutes = require("./src/routes/messageRoutes");
// const slackRoutes = require('./src/routes/slack')
const fileUploadRoutes = require('./src/routes/fileUpload')
const errorHandler = require('./src/middlewares/errorHandlerMiddleware')
connectDB();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())


const server = http.createServer(app);

const io = new Server(server);

// REST APIs
// app.use("/api/room", roomRoutes);
// app.use("/api/user", userRoutes);
// app.use("/api/message", messageRoutes);
// app.use("/api/slack", slackRoutes);
app.use("/api/uploads", fileUploadRoutes);

// SOCKET.IO
// io.on("connection", (socket) => {
//   console.log("✅ User connected:", socket.id);

//   // 🔹 Join Room
//   socket.on("joinRoom", ({ roomId }) => {
//     socket.join(roomId);
//     console.log(`Socket ${socket.id} joined room ${roomId}`);
//   });

//   // 🔹 Receive Message
//   socket.on("sendMessage", async ({ text, userId, roomId }) => {
//     try {
//       // save message in DB
//       const message = await Message.create({
//         message: text,
//         user: new mongoose.Types.ObjectId(userId),
//         room: new mongoose.Types.ObjectId(roomId),
//       });

//       // emit to all users in room
//       io.to(roomId).emit("newMessage", {
//         _id: message._id,
//         text: message.message,
//         user: message.user,
//         room: message.room,
//         createdAt: message.createdAt,
//       });
//     } catch (error) {
//       console.error("❌ Message error:", error.message);
//     }
//   });

//   socket.on("disconnect", () => {
//     console.log("❌ User disconnected:", socket.id);
//   });
// });

app.use(errorHandler)

server.listen(3000, () => {
  console.log("🚀 Server running on port 3000");
});
