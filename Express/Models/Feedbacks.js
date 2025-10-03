const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  guest: { type: mongoose.Schema.Types.ObjectId, ref: "user" }, 
  guestEmail: { type: String },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comments: { type: String },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Feedback", feedbackSchema);
