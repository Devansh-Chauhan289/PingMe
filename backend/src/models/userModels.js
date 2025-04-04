import { model, Model, Schema } from "mongoose";

const userschema = new Schema({
    fullname : {
        type : String,
        required : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
    token : {
        type : String
    },
    friends : {
        type : Array,
        default : [],
    },
    pfp : {
        type : String,
    }
})

const Users = model("Users", userschema)

export {
    Users
}