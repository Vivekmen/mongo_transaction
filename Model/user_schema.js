const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    sName:{
        type:String,
        required:true,
    },
    sPassword:{
        type:String,
        required:true
    },
    nMobile_no:{
        type:Number,
        required:true
    }

},{timestamps:true})

const user=mongoose.model("User",userSchema);
module.exports=user;