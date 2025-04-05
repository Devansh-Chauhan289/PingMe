import { model, Schema } from "mongoose";


const  Convo = new Schema({
    members : {
        type : Array,
        required : true,
    }
})

const ConvoModel = model("Convo",Convo)

export {
    ConvoModel
}