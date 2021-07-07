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
        let chartLabels = []
        let moodData = []
        let stressData = []
        let sleepData = []
        let sportData= [] 
        let socialsData=[] 
        let workData = []

        let drugData = []
        
        let menstruationData = []
        let weatherData = [] 
        let medicationData= [] 
        let nutritionData = []
     
       
        
        
        MoodModel.find({userId: user._id})
            .then((moodArr)=> {
                moodArr.forEach((mood) => {
                    let creationDate = new Date(mood.createdAt).toDateString()
                    let creationTime = new Date(mood.createdAt).toLocaleTimeString()
                    let ourTimestamp = creationDate.concat(' TIME: ', creationTime)

                    chartLabels.push(ourTimestamp)

                    moodData.push(Number(mood.mood))
                    stressData.push(Number(mood.stress))
                    sleepData.push(Number(mood.sleep))
                    sportData.push(Number(mood.sport))
                    socialsData.push(Number(mood.socials))
                    workData.push(Number(mood.work))
                    drugData.push(Number(mood.drugs))
                    menstruationData.push(Number(mood.menstruation))
                    weatherData.push(Number(mood.weather))
                    medicationData.push(Number(mood.medication))
                    nutritionData.push(Number(mood.nutrition))
                   

                })
                
              res.render("auth/statistics.hbs",  {   

                    chartLabels: JSON.stringify(chartLabels),
                  
                    moodData: JSON.stringify(moodData),
                    stressData: JSON.stringify(stressData),
                    sleepData: JSON.stringify(sleepData),
                    sportData: JSON.stringify(sportData),
                    socialsData: JSON.stringify(socialsData),
                    workData: JSON.stringify(workData),
                    drugData: JSON.stringify(drugData),
                    menstruationData: JSON.stringify(menstruationData),
                    weatherData: JSON.stringify(weatherData),
                    medicationData: JSON.stringify(medicationData),
                    nutritionData: JSON.stringify(nutritionData)
            
                });
            })   
    }); 

module.exports = router;