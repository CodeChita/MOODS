const { Schema, model } = require("mongoose");
require('./Mood.model')

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    required: true
  },
  password:{
   type: String,
   required: true
   
  },
  
  email: {
    type: String,
    required: true
  },

  confirmationCode:{
    type: String,
    unique: true
  },

  status: {
    type: String,
    enum: ['Pending confirmation', 'Active'],
    default: 'Pending confirmation'
  }, 

});


const User = model("User", userSchema);
module.exports = User;
