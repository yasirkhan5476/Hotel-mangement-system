var mongoose=require("mongoose");
var userschema=mongoose.Schema({
    username: String,
    email: String,
    password: String,
    role:String
})

module.exports=mongoose.model("user",userschema);