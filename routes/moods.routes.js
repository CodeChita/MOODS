const router = require("express").Router();
const UserModel = require("../models/User.model");
const MoodModel = require("../models/Mood.model")

router.get('/createmood', (req, res, next) => {
    res.render('auth/moods-create')
})

router.post('/createmood', (req, res, next) =>{
    const {mood, sleep, stress} = req.body
    const user = req.session.loggedInUser
    MoodModel.create({mood, sleep, stress, userId: user._id})
    .then(() => {
        MoodModel.find({userId: user._id})
        .then(() => {
            res.redirect('/profile')
        })
    })
    .catch((err) => {
        console.log(err)
    })
})



module.exports = router;