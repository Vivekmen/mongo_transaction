const mongoose=require('mongoose');


module.exports=function Databaseconnect(){mongoose.connect("mongodb+srv://vivekmenapara:Vivek%402998@cluster0.a8lohon.mongodb.net/Transacation_db?readPreference=secondaryPreferred")
         .then(()=>console.log("Data base Connected"))
         .catch((err)=>console.log("Mongo error",err));
}