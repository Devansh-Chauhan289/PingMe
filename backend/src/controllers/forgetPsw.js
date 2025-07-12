import { Users } from "../models/userModels.js"
import crypto from "crypto"
import nodemailer from "nodemailer"
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()


const ForgetPsw = async(req,res) =>{
    const {email} = req.body

    if (!email) {
        return res.status(400).json({ msg: "Please provide an email address" })
    }

    try {
        const user = await Users.findOne({email})
        if(!user){
            return res.status(404).json({msg : "User not found"})
        }

        user.resetToken = crypto.randomInt(10000,99999)
        user.resetExp = Date.now() + 600000
        await user.save()
        const trans = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : process.env.SMTP_USER,
                pass : process.env.SMTP_PASS
            }
        })

        const mail = {
            from : "foryouasap@gmail.com",
            to : email,
            subject : "PASSWORD RESET REQUEST",
            html : `
                <p>Dear ${user.fullname}</p>
                <br />
                <p>Your Password reset code is given below please use it to create new password</p>
                <p>${user.resetToken}</p>
            `
        }

        trans.sendMail(mail,(err,info) => {
            if(err){
                return res.status(400).json({msg : "Something Went Wrong"})
            }

            return res.status(200).json({msg : "Token Sent Successfully",token : user.resetToken})
        })
    } catch (error) {
        console.log("Error Occurred",error);
        return res.status(500).json({msg : "Internal Error"})
    }
    
}


const ResetPsw = async(req,res) => {
    const {email,psw,token} = req.body
    try {
        if(!email || !psw || !token){
            return res.status(400).json({msg : "Invalid Req"})
        }

        const user = await Users.findOne({email})
        if(user.resetToken.toString() !== token){
            return res.status(400).json({msg : "Invalid OTP"})
        }
        console.log(Date.now());
        console.log(user.resetExp);
        if(user.resetExp < Date.now()){
            return res.status(400).json({msg : "OTP Expired"})
        }
        bcrypt.hash(psw,10,async(err,info) => {
            if(err){
                return res.status(400).json({msg : "Invalid Req"})
            }

            user.set("password",info)
            await user.save()
        })

        return res.status(201).json({msg : "Password Updated"})
    } catch (error) {
        console.log("Error Occurred",error);
        return res.status(500).json({msg : "Internal Error"})
    }
}



export{
    ForgetPsw,
    ResetPsw
}
