import mongoose from "mongoose";

const userSchema = mongoose.Schema({
name:{
    type:String,
    required:[true,'please insert your name']
},
email:{
    type:String,
    required:[true,'please insert your email'],
     unique:[true,"Email address already taken"]
},
password:{
type:String,
required:[true,'password is necessary']
},
balance:{
    type:Number,
    default:1000
},
resetToken: {String},
resetTokenExpires: {Date},


},
{timestamps: true});

export default mongoose.model("User",userSchema);