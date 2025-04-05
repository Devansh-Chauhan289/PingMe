import { model, Schema } from "mongoose";


const  Messages = new Schema({
    convoId : {
        type : String,
    },
    senderId : {
        type : String,
        required : true,
    },
    messages : {
        type : String,
        required : true,
    }

})

const MsgModel = model("Messages",Messages)

export {
    MsgModel
}