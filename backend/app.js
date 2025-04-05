import express from "express";
import mongoose from "mongoose";
import { UserRouter } from "./src/routes/userRouter.js";
import { convoRouter } from "./src/routes/convoRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from 'socket.io';

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Initialize Socket.IO
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    
    //Add user to conversation
    // Join a conversation
    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });
    
    // Leave a conversation
    socket.on("leave_conversation", (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.id} left conversation: ${conversationId}`);
    });
    
    // Send a message
    socket.on("send_message", (data) => {
        io.to(data.conversationId).emit("receive_message", data);
        console.log(`Message sent in conversation ${data.conversationId}:`, data);
    });
    
    // User typing
    socket.on("typing", (data) => {
        socket.to(data.conversationId).emit("user_typing", {
            userId: data.userId,
            isTyping: data.isTyping
        });
    });
    
    // User online status
    socket.on("user_online", (userId) => {
        socket.broadcast.emit("user_status", { userId, status: "online" });
    });
    
    // User offline status
    socket.on("user_offline", (userId) => {
        socket.broadcast.emit("user_status", { userId, status: "offline" });
    });
    
    // Disconnect
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

app.use("/user", UserRouter)
app.use("/", convoRouter)

// Use httpServer.listen instead of app.listen
httpServer.listen(PORT, () => {
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("Database connected successfully");
        console.log(`Server is running on http://localhost:${PORT} `);
    } catch (error) {
        return console.log("Database connection failed", error);
    }
})