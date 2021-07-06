const router = require("express").Router();
const UserModel = require("../models/User.model");
const MoodModel = require("../models/Mood.model");

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
        const user = req.session.loggedInUser
        let moodData = []
        let stressData = []
        let sleepData = []
        let chartLabels = ['Mood 1', 'Mood 2', 'Mood 3', 'Mood 4', 'Mood 5', 'Mood 6']
        
        MoodModel.find({userId: user._id})//.sort({createdAt: -1})
            .then((moodArr)=> {
                moodArr.forEach((mood) => {
                    moodData.push(Number(mood.mood))
                    stressData.push(Number(mood.stress))
                    sleepData.push(Number(mood.sleep))


                })
                
              res.render("auth/statistics.hbs",  {
                  
                    moodData: JSON.stringify(moodData),
                    //stressData: JSON.stringify(stressData),
                    //sleepData: JSON.stringify(sleepData),
                    chartLabels: JSON.stringify(chartLabels)
                });
            })   
    }); 

module.exports = router;