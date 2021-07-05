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
        .then((moods) => {
            console.log(moods)
        })
    })
    .catch((err) => {
        console.log(err)
    })
})


//ROUTE TO SHOW CHART
    router.get("/statistics", (req, res, next) => {
        let chartData = [12, 19, 3, 5, 2, 3]
        let chartLabels = ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange']
        
        res.render("auth/statistics.hbs", {
          chartData: JSON.stringify(chartData),
          chartLabels: JSON.stringify(chartLabels)
        });
      }); 

module.exports = router;