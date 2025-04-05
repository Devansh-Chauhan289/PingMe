import express from "express";
import mongoose from "mongoose";
import { UserRouter } from "./src/routes/userRouter.js";
import { convoRouter } from "./src/routes/convoRouter.js";


const app = express();

const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/user",UserRouter)
app.use("/",convoRouter)

app.listen(PORT, () => {
    try {
        mongoose.connect("mongodb+srv://devanshchauhan2306:devansh289@pingme.hu7g7ys.mongodb.net/?retryWrites=true&w=majority&appName=PingMe")
        console.log("Database connected successfully");
        console.log(`Server is running on http://localhost:${PORT} `);
    } catch (error) {
        return console.log("Database connection failed", error);
    }
    
})