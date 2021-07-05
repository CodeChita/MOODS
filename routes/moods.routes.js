const router = require("express").Router();
const UserModel = require("../models/User.model");

router.get('/createmood', (req, res, next) => {
    res.render('auth/moods-create')
})

router.post('/createmood', (req, res, next) =>{
    const {Mood, Sleep, Stress} = req.body
    console.log(Mood, Sleep, Stress)
})
module.exports = router;