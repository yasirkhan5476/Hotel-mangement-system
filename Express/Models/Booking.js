const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  guestName: { type: String, required: true },
  guestEmail: { type: String },  
  room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true }, 
  checkIn: { type: Date, required: true },
  checkOut: { type: Date, required: true },
  adults: { type: Number, default: 1 },
  children: { type: Number, default: 0 }  ,
  roomCount: { type: Number, default: 1 },
  dynamicPrice: { type: Number }, 
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
  role: { type: String, enum: ["guest", "receptionist","admin"], default: "guest" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
