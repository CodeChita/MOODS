const router = require("express").Router();
const UserModel = require("../models/User.model");
const MoodModel = require("../models/Mood.model")
const bcrypt = require('bcryptjs')
const nodemailer = require('nodemailer')

//GET logout
// router.get("/logout", (req, res, next) => {
//   req.session.destroy();
//   req.app.locals.loggedIn = false;
//   res.redirect("/");
// });

//POST login  (also on home screen)
router.post('/', (req, res, next) => {
  const {username, password} = req.body
  if(!username || !password){
    res.render('index.hbs', {error: "Please enter your username and password to continue"})
    return
  }

  UserModel.findOne({username})
    .then((user) => {
      if(user){
        const comparedPassword = bcrypt.compareSync(password, user.password);
        if(comparedPassword){
          req.session.loggedInUser = user;
          req.app.locals.isLoggedin = true;
          res.redirect("/profile");
        }
      }
      else
        res.render("index", {error: 'wrong password or username'})
    })
    .catch((err) => {
      console.log('check')
      next(err)
    })
})

//_____________GET signup_____________
router.get('/signup', (req,res,next) => {
    res.render('auth/signup')
})

//_____________POST signup____________
router.post('/signup', (req, res, next) => {
//grab username & password & mail from form
  const {username, password, email} = req.body; 
  const mailRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
  const salt = bcrypt.genSaltSync(12) 
  const securePW = bcrypt.hashSync(password, salt)
  //check if username & password both entered //made a ternaryoperator 
  if(!username || !password){
    res.render('auth/signup.hbs', {error: 'please fill in all fields'})
    return
  }
  if(!mailRegex.test(email)){
    res.render('auth/signup', {error: 'Your email needs to be of a valid format, e.g. hello@moods.com'})
    return
  }
  if(!passRegex.test(password)){
    res.render('auth/signup', {error: 'For security reasons, your password has to include at least 9 characters, at least one number, at least one special character.'})
    return
  }

  //check if username is unique
  UserModel.findOne({username})
    .then((username) => {
      res.render('auth/signup',{error:`Sorry, the username ${user.username} is already used by someone else. Please choose another one.`})
    })
    .catch((username, email, password) => {
      next()
    })

  UserModel.create({username, email, password: securePW})
    .then(() => {
      console.log('im here')
      res.redirect('/')
    })
    .catch((err) => {
      next(err)
    })
})

// create custom middleware for authentication
 checkAuthStat = (req, res, next) => 
req.session.loggedInUser ? next() : res.redirect('/') 

router.get('/profile', checkAuthStat, (req, res, next) => {
    res.render('auth/profile', {name: req.session.loggedInUser.username})
})

//------------ adding loved ones account ------------

module.exports = router;
