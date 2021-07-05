const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the user model to whatever makes sense in this case
const userSchema = new Schema({
  username: {
    type: String,
    unique: true  //ideally, should be unique, but its up to you
  },
  status: {    //only for email confirmation process 

    type: String,
    enum: ['active', 'pending confirmation'],
    default: 'pending confirmation'
  },

  confirmationCode:{                //only for email confirmation process 
type: String,
unique: true
  },

  password: String,
  
  email: String
});

const User = model("User", userSchema);

module.exports = User;
