import { ForgetPsw, ResetPsw } from "../controllers/forgetPsw.js";
import { UserLogin, UserSignup } from "../controllers/usersController.js";
import express from "express";

const UserRouter = express.Router()

UserRouter.post("/signup", UserSignup)
UserRouter.post("/login",UserLogin)
UserRouter.post("/forgot",ForgetPsw)
UserRouter.put("/forgot/reset-psw",ResetPsw)


export {
    UserRouter
}