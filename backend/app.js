import express from "express";
import mongoose from "mongoose";
import { UserRouter } from "./src/routes/userRouter.js";
import { convoRouter } from "./src/routes/convoRouter.js";
import dotenv from "dotenv";
import cors from "cors";
import { createServer } from "http";
import { Server } from 'socket.io';
import { Users } from "./src/models/userModels.js";
import rateLimit from "express-rate-limit";

dotenv.config();

const app = express();
const httpServer = createServer(app);
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const io = new Server(httpServer, {
    cors: {
        origin: ["https://ping-me-client.vercel.app", "http://localhost:5173"],
        methods: ["GET", "POST"]
    }
});


const onlineUsers = new Map();

io.on("connection", (socket) => {
    console.log("User connected", socket.id);
    
    
    
    socket.on("Add-user", (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            console.log(`User ${userId} is now online`);
            io.emit("getUsers", Array.from(onlineUsers.keys()));
        }
    });
    
   
    socket.on("join_conversation", (conversationId) => {
        socket.join(conversationId);
        console.log(`User ${socket.id} joined conversation: ${conversationId}`);
    });
    
    
    socket.on("leave_conversation", (conversationId) => {
        socket.leave(conversationId);
        console.log(`User ${socket.id} left conversation: ${conversationId}`);
    });
    
    
    socket.on("send_message", (data) => {
        io.to(data.conversationId).emit("receive_message", data);
        console.log(`Message sent in conversation ${data.conversationId}:`, data);
    });
    
    
    socket.on("typing", (data) => {
        socket.to(data.conversationId).emit("user_typing", {
            userId: data.userId,
            isTyping: data.isTyping
        });
    });
    
    
    socket.on("user_online", (userId) => {
        if (userId) {
            onlineUsers.set(userId, socket.id);
            socket.broadcast.emit("user_status", { userId, status: "online" });
            
            io.emit("getUsers", Array.from(onlineUsers.keys()));
        }
    });
    
    
    socket.on("user_offline", (userId) => {
        if (userId) {
            onlineUsers.delete(userId);
            socket.broadcast.emit("user_status", { userId, status: "offline" });
            
            io.emit("getUsers", Array.from(onlineUsers.keys()));
        }
    });
    
    
    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
       
        for (const [userId, socketId] of onlineUsers.entries()) {
            if (socketId === socket.id) {
                onlineUsers.delete(userId);
                socket.broadcast.emit("user_status", { userId, status: "offline" });
                
                io.emit("getUsers", Array.from(onlineUsers.keys()));
                break;
            }
        }
    });
});

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
    origin: ["https://ping-me-client.vercel.app", "http://localhost:5173"],
    methods: ["GET", "POST"],
    credentials: true
}))
app.use(limiter);

app.use("/user", UserRouter)
app.use("/", convoRouter)


httpServer.listen(PORT, () => {
    
    try {
        mongoose.connect(process.env.DB_URL)
        console.log("Database connected successfully");
        console.log(`Server is running on http://localhost:${PORT} `);
    } catch (error) {
        return console.log("Database connection failed", error);
    }
})