import mongoose from "mongoose";
import { Schema } from "mongoose";

const userSchema = new Schema ({
    name: {
        type : String,
        required : true
    },
    email: {
        type : String,
        required : true
    },
    password: {
        type : String,
        required : true
    },
    profile_img: {
        type : String,
        default : ''
    },
    is_active: {
        type : Boolean,
        default : false
    },
    is_deleted: {
        type : Boolean,
        default : false
    },
}, {timestamps : true})

const User = mongoose.model('user', userSchema);
export {User}