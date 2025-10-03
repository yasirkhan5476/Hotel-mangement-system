var mongoose=require("mongoose");

var productschema=mongoose.Schema({
    productName: String,
    productDesc: String,
    productPrice: Number,
    productImage: String
})

module.exports=mongoose.model("imguplaod",productschema);