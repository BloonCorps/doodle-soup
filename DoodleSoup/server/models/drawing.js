const mongoose = require("mongoose");

//A drawing's source is a URI that represents it
//and the creator is an ID
const DrawingSchema = new mongoose.Schema({
  creator: Number,
  source: String,
});

module.exports = mongoose.model("drawing", DrawingSchema);