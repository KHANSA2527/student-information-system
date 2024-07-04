import mongoose from "mongoose";
import { Schema } from "mongoose";

const otpSchema = new Schema ({
    email: {
        type : String,
        required : true
    },
    otp: {
        type : String,
        required : true
    },
    otp_retries : { 
        type : Number,
        default : 0
    }
   
}, {timestamps : true})

const OTP = mongoose.model('otp', otpSchema);
export {OTP}