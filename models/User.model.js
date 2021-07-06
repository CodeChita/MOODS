const { Schema, model } = require("mongoose");
// require('./Mood.model')
// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
  },
  password: String,
  email: {
    type: String,
  },
  mainUser: {
    type: Boolean,
    default: true
  }
});


const User = model("User", userSchema);
module.exports = User;
