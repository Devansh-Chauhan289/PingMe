import { Users } from "../models/userModels"
import crypto from "crypto"
import nodemailer from "nodemailer"


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

        const resetToken = crypto.randomBytes(32).toString("hex")
        const resetExp = Date.now() * 600000

        const trans = nodemailer.createTransport({
            service : "gmail",
            auth : {
                user : "foryouasap@gmail.com",
                pass : "smdjnjiiebb"
            }
        })

        const mail = {
            from : "foryouasap@gmail.com",
            to : email,
            subject : "PASSWORD RESET REQUEST",
            html : `
                <p>Dear ${user.name}</p>
                <br />
                <p>Your Password reset code is given below please use it to create new password</p>
                <p>${resetToken}</p>
            `
        }

        trans.sendMail(mail,(err,info) => {

        })
    } catch (error) {
        
    }
    
}