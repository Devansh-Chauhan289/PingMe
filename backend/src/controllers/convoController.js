import { ConvoModel } from "../models/convoModel.js";
import { MsgModel } from "../models/messageModel.js";
import { Users } from "../models/userModels.js";



const StartConvo = async(req,res) => {
    const {senderId,receiverId} = req.body;
    try {
        const newconvo = new ConvoModel({
            members : [ senderId,receiverId ]
        })
        await newconvo.save()
        res.status(200).json({
            msg : "Convo Created Successfully"
        })
    } catch (error) {
        console.log("Error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const GetConvo = async(req,res) => {
    const {userId} = req.params;
    try {
        const convo = await ConvoModel.find({members : {$in : [userId]}})
        if(!convo){
            return res.status(404).json({
                msg : "not found"
            })
        }

        const convouser = await Promise.all(convo.map(async(con) => {
            const receiverId = await con.members.find((member) => member !== userId)
            const user = await Users.findById(receiverId)
            return {userData : {
                id : user._id,
                pfp : user.pfp,
                email : user.email,
                fullname : user.fullname,
                convoId : con._id
            }}
        }))
        
        return res.status(200).json(convouser)
    } catch (error) {
        console.log("error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const SendMsg = async(req,res) => {
    const {senderId,convoId,messages,receiverId = ""} = req.body;
    try {
        if(!senderId || !messages){
            return res.status(400).json({
                msg : "Please fill required fields"
            })
        }
        
        let conversationId = convoId;
        
        if(convoId === "new" && receiverId){
            console.log("Creating new conversation between:", senderId, "and", receiverId);
            const newConvo = new ConvoModel({ members : [senderId,receiverId]})
            const user = await Users.findById(senderId)
            user.set({
                friends : [...user.friends,receiverId]
            })
            await user.save()
            await newConvo.save()
            conversationId = newConvo._id;
            const newMsg = new MsgModel({convoId : newConvo._id,senderId,messages})
            await newMsg.save()
            
            return res.status(200).json({
                msg : "Msg sent Successfully",
                convoId: conversationId
            })
        } else if(!convoId && !receiverId){
            return res.status(400).json({
                msg : "fill require fields"
            })
        }
        
        const newMsg = new MsgModel({
            senderId,
            messages,
            convoId
        })
        console.log("New Message",newMsg);
        await newMsg.save()
        
        return res.status(200).json({
            msg : "Message Sent Successfully",
            convoId: conversationId
        })
    } catch (error) {
        console.log("Error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


const getMsg = async(req,res) => {

    const {convoId} = req.params;
    try {
        const checkMessages = async(convoId) => {
            const msgs = await MsgModel.find({convoId})
            const msguserData = await Promise.all(msgs.map(async(msg) => {
                const user = await Users.findById(msg.senderId)
                return {
                    id : user._id,
                    msg : msg.messages,
                    senderId : msg.senderId,
                    fullname : user.fullname,
                    email : user.email
                }
            }))
            return res.status(200).json(msguserData)
        }
        
        if (convoId === "new") {
            const checkconvo = await ConvoModel.find({members : {$all : [req.query.senderId,req.query.receiverId]}})
            if(checkconvo.length > 0){
                return checkMessages(checkconvo[0]._id)
            } else{
                return res.status(200).json([]);
            }
        } else{
            return checkMessages(convoId)
        }
    } catch (error) {
        console.log("error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}

const GetUsers = async(req,res) => {
    const {userId} = req.params;
    try {
        const users = await Users.find({_id : {$ne : userId}})
        const userData = users.map((user) => {
            return {
                fullname : user.fullname,
                email : user.email,
                id : user._id,
                pfp : user.pfp || "",
            }
        })
        return res.status(200).json(
            userData
        )
    } catch (error) {
        console.log("error Occured",error);
        res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}




export {
    StartConvo,
    GetConvo,
    SendMsg,
    getMsg,
    GetUsers
}