const mongoose = require("mongoose");

//Actually need to program friends and works in
const UserSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  works: Array,

  //implementation of friends
  friends: Array,
});

// compile model from schema
module.exports = mongoose.model("user", UserSchema);
