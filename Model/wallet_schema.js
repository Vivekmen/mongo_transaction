const mongoose=require('mongoose');
const User=require('./user_schema')
const walletSchema=new mongoose.Schema({
    nBalanace:{
        type:Number,
        required:true
    },
    iUserId:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
},{timestamps:true})

const wallet=mongoose.model("Wallet",walletSchema);
module.exports=wallet;