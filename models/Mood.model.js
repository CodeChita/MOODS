const {Schema, model} = require('mongoose');



const MoodSchmea = new mongoose.Schema({     //do we need to put 'mongoose' here?



})





const MoodModel = mongoose.model('Mood', MoodSchema)    //same question










module.exports = MoodModel;