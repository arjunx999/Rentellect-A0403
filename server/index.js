import express from "express";
import { Server } from "socket.io";
import http from "http";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import bookRoutes from "./routes/bookRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import messageRoutes from "./routes/messageRoutes.js";
// import uploadRoutes from "./routes/uploadRoutes.js";
import { Message } from "./models/message.js";
import collegeRoutes from "./routes/collegeRoutes.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    credentials: true,
  },
});

connectDB();

app.use(cors());
app.use(express.json());

// app.use("/upload", uploadRoutes);
app.use("/user", userRoutes);
app.use("/auth", authRoutes);
app.use("/book", bookRoutes);
app.use("/messages", messageRoutes);
app.use("/colleges", collegeRoutes);

const onlineUsers = new Map();

io.on("connection", (socket) => {
  // client connection
  socket.on("user-connected", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  // client disconnection
  socket.on("disconnect", () => {
    for (const [userId, sockId] of onlineUsers.entries()) {
      if (sockId === socket.id) {
        onlineUsers.delete(userId);
        break;
      }
    }
  });

  // messaging
  socket.on("send-message", async ({ senderId, receiverId, content }) => {
    try {
      const messageData = {
        sender: senderId,
        receiver: receiverId,
        content,
      };

      const newMessage = new Message(messageData);
      await newMessage.save();

      // Emit if receiver is online
      const receiverSocketId = onlineUsers.get(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive-message", newMessage);
      }
    } catch (error) {
      console.error("Error in sending message:", error.message);
    }
  });
});

const PORT = process.env.PORT || 9999;
server.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
