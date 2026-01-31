const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const connectDB = require("./config/db");
const Message = require("./models/Message");
const mongoose = require("mongoose");

connectDB(); // MongoDB connection

const app = express();
const httpServer = http.createServer(app); // Express + Socket server
const io = new Server(httpServer);

app.use(express.json());

/* ---------------- GLOBAL SYSTEMS ---------------- */

// Rate limiter → spam control (userId -> timestamps array)
const rateLimiter = new Map();

// Queue → DB down hone par messages temporarily store honge
let messageQueue = [];

// Circuit breaker flag → DB working hai ya nahi
let isDBHealthy = true;

/* ---------------- DATABASE HEALTH MONITOR ---------------- */

// Har 5 sec DB ko ping karte hain
// Agar DB wapas online aaye → queued messages flush
setInterval(async () => {
  try {
    await mongoose.connection.db.admin().ping();
    isDBHealthy = true;
    flushQueue();
  } catch {
    isDBHealthy = false;
  }
}, 5000);

/* ---------------- QUEUE FLUSH FUNCTION ---------------- */

// Queue ke messages DB me save karte jab DB theek ho jaye
async function flushQueue() {
  while (isDBHealthy && messageQueue.length) {
    const msg = messageQueue.shift(); // oldest message
    await saveAndEmit(msg);
  }
}

/* ---------------- SAVE + BROADCAST FUNCTION ---------------- */

// 1. Message DB me save
// 2. Room me broadcast
// 3. Client ko ACK send
async function saveAndEmit({ roomId, userId, content, callback }) {
  const savedMsg = await Message.create({
    roomId,
    userId,
    content,
    status: "delivered",
  });

  io.to(roomId).emit("receiveMessage", savedMsg);

  if (callback) callback({ success: true, message: "Delivered" });
}

/* ---------------- SOCKET CONNECTION ---------------- */

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  // User room join karega
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  /* ----------- MAIN MESSAGE HANDLER ----------- */

  socket.on("sendMessage", async (data, callback) => {
    const { roomId, content } = data;
    const userId = socket.id;
    const now = Date.now();

    // Validation → empty ya long message reject
    if (!content || content.trim() === "" || content.length > 500) {
      return callback({ success: false, message: "Invalid message" });
    }

    /* ----------- RATE LIMITING (max 10 requests/min) ----------- */
    let timestamps = rateLimiter.get(userId) || [];
    timestamps = timestamps.filter((t) => now - t < 60000);

    if (timestamps.length >= 10) {
      return callback({ success: false, message: "Rate limit exceeded" });
    }

    timestamps.push(now);
    rateLimiter.set(userId, timestamps);

    /* ----------- DB DOWN? USE QUEUE ----------- */
    if (!isDBHealthy) {
      if (messageQueue.length >= 100) {
        return callback({ success: false, message: "Server busy" });
      }

      messageQueue.push({ roomId, userId, content, callback });
      return;
    }

    /* ----------- TRY SAVING MESSAGE ----------- */
    try {
      await saveAndEmit({ roomId, userId, content, callback });
    } catch {
      // Agar DB save fail ho → queue mode
      isDBHealthy = false;
      messageQueue.push({ roomId, userId, content, callback });
    }
  });

  // Disconnect hone par user ka rate limit data cleanup
  socket.on("disconnect", () => {
    rateLimiter.delete(socket.id);
    console.log("User disconnected:", socket.id);
  });
});

httpServer.listen(3000, () => {
  console.log("Server running on port 3000");
});
