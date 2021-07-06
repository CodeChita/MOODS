const {Schema, model} = require('mongoose');
const mongoose = require('mongoose')
require('./User.model')
const MoodSchema = new Schema({   
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
    }},
    {
    timestamps: true
})
const MoodModel = model('Mood', MoodSchema)  










module.exports = MoodModel;