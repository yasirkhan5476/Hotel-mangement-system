var mongoose= require("mongoose");
var roomSchema=mongoose.Schema({
     roomName:{type:String},
     roomNumber: { type: Number },
     roomType: { type: String}, 
     price: { type: Number},
     status: { type: String, default: "available" }, 
     image: { type: String },
     description: { type: String },
     isAvailable: { type: Boolean, default: true }
}, { timestamps: true });
module.exports=mongoose.model("Room",roomSchema);