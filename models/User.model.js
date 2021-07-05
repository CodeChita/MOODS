const { Schema, model } = require("mongoose");
require('./Mood.model')
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true  //ideally, should be unique, but its up to you
  },
  password: String,
  
  email: String,

});
const User = model("User", userSchema);
module.exports = User;
