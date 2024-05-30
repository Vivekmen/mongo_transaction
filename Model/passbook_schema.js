const mongoose=require('mongoose');

const passbookSchema=new mongoose.Schema({
    iUserId:{
        type:mongoose.Schema.Types.ObjectId,ref: "User"
    },
    iTransactionId:{
        type:mongoose.Schema.Types.ObjectId,ref: "Wallet"
    },
    imoneyreciverId:{
        type:mongoose.Schema.Types.ObjectId,ref: "User"
    },
    nBalanace:{
        type:Number,
        required:true
    }
    

},{timestamps:true})

const passbook=mongoose.model("Passbook",passbookSchema);
module.exports=passbook;