import { Users } from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config()


const GetMessages = async(req,res) => {

    try {
        return res.status(200).json({
            success : true
        })
    } catch (error) {
        console.log("Error Occures",error);
        return res.status(500).json({
            success : false,
            msg : "Internal Server Error"
        })
    }
}


const UserSignup = async(req,res) => {
    
    const { fullname,email,password } = req.body;

    try {
        if(!fullname || !email || !password) {
            return res.status(400).json({
                msg : "Please fill all the fields"
            })
        }
        
        const isExists = await Users.findOne({email})
        if(isExists) {
            return res.status(400).json({
                msg : "User already exists"
            })
        }

        const newuser = await Users({
            fullname,
            email
        })
        bcrypt.hash(password,10,async(err,res)=> {
            if(err){
                console.log("Error Occured",err);
                return res.status(500).json({
                    msg : "Internal Server Error"
                })
            }
            newuser.set("password",res)
            await newuser.save()
        })

        return res.status(200).json({
            success : true,
            msg : "User Created Successfully"
        })
        

    } catch (error) {
        console.log("Error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const UserLogin = async(req,res) => {
    
    const { email,password } = req.body;

    try {
        if( !email || !password) {
            return res.status(400).json({
                msg : "Please fill all the fields"
            })
        }
        
        const user = await Users.findOne({email})
        if(!user) {
            return res.status(404).json({
                msg : "User does not exists"
            })
        }

        const isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch) {
            return res.status(400).json({
                msg : "Invalid Credentials"
            })
        }
        
        const Authtoken = jwt.sign({ id : user._id },process.env.JWT_SECRET_KEY, {
            expiresIn : "1d"
        })
        user.set("token",Authtoken)
        await user.save()

        return res.status(201).json({

            msg : "User loggedIn Successfully",
            user,
            token : Authtoken
        })
        

    } catch (error) {
        console.log("Error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}

export {
    UserSignup,
    GetMessages,
    UserLogin
}