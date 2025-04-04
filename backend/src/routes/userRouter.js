import { UserLogin, UserSignup } from "../controllers/usersController.js";
import express from "express";

const UserRouter = express.Router()

UserRouter.post("/signup", UserSignup)
UserRouter.post("/login",UserLogin)



export {
    UserRouter
}