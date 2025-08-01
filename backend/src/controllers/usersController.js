import { Users } from "../models/userModels.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { cloudinary } from "../middlewares/cloudinary.js";
import { Upload } from "../middlewares/multer.js";

dotenv.config()


const MediaController = async(req,res) => {
    if(!req.file){
        return "No file Found"
    }
    return new prompt((resolve,reject) => {
        cloudinary.uploader.Upload(req.file.path,(result,error) => {
            if(error){
                console.log("Error uploading to Cloudinary", error);
                return reject("error uploading to Cloudinary");
            }

            resolve(result.url)
        })
    })
}

const mediacontroller = async (req) => {
    
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(req.file.path, (result, error) => {
            if (error) {
                console.log("Error - ", error);
                return reject("Error uploading media");
            }
            
            resolve(result.url); 
            console.log("this is url",result.url);
        });
    });
};

const ChangePfp = async(req,res) => {
    let newuser = JSON.parse(req.body.user);
    console.log(req.file);
    try {
        let url;
        if(req.file){
           url = await mediacontroller(req) 
        }

        let olduser = await Users.findById(newuser._id)
        
        if(!olduser) {
            return res.status(404).json({
                msg : "User not found"
            })
        }
        olduser.set("pfp", url)
        
        await olduser.save()
        return res.status(200).json({
            success : true,
            msg : "Profile picture changed successfully",
            user : olduser
        })
    }
    catch (error) {
        console.log("Error Occures",error);
        return res.status(500).json({
            success : false,
            msg : "Internal Server Error"
        })
    }
}


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
    UserLogin,
    ChangePfp
}