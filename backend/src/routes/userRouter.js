import { ForgetPsw, ResetPsw } from "../controllers/forgetPsw.js";
import { ChangePfp, UserLogin, UserSignup } from "../controllers/usersController.js";
import express from "express";
import { Upload } from "../middlewares/multer.js"; 

const UserRouter = express.Router()

UserRouter.post("/signup", UserSignup)
UserRouter.post("/login",UserLogin)
UserRouter.post("/forgot",ForgetPsw)
UserRouter.put("/forgot/reset-psw",ResetPsw)
UserRouter.post("/change-pfp",Upload.single("file"),ChangePfp)


export {
    UserRouter
}