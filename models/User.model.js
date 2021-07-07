const { Schema, model } = require("mongoose");
require('./Mood.model')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true  
  },
  password: String,
  
  email: String,

  confirmationCode:{

    type: String,
    unique: true
  },

  status: {
    type: String,
    enum: ['Pending confirmation', 'Active']
  }

});


const User = model("User", userSchema);
module.exports = User;
