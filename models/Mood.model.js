const {Schema, model} = require('mongoose');
const mongoose = require('mongoose')
require('./User.model')
const MoodSchema = new Schema({     //do we need to put 'mongoose' here?
    mood: {
        type: String, 
    },
    sleep: {
        type: String, 
    }, 
    stress: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
})
const MoodModel = model('Mood', MoodSchema)    //same question
module.exports = MoodModel;