import { ConvoModel } from "../models/convoModel.js";
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
                msg : "No Conversation Found"
            })
        }

        const convouser = Promise.all(convo.map(async(con) => {
            const receiverId = await con.members.find((member) => member !== userId)
            return await Users.findById(receiverId)
        }))
        
        return res.status(200).json({
            msg : "Conversations Fetched Successfully",
            convo,
            convouser
        })
    } catch (error) {
        console.log("error Occured",error);
        return res.status(500).json({
            msg : "Internal Server Error"
        })
    }
}


export {
    StartConvo,
    GetConvo
}