const router = require("express").Router();
const UserModel = require("../models/User.model");
const bcrypt = require('bcryptjs')

// GET logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.app.locals.loggedIn = false;
  res.redirect("/");
});

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
          return
        }
        return
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
  const {username, password, email} = req.body; 
  const mailRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  const passRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
  const salt = bcrypt.genSaltSync(12) 
  const securePW = bcrypt.hashSync(password, salt)

  if(!username || !password){
    res.render('auth/signup.hbs', {error: 'please fill in all fields',})
    return
  }

  if(!mailRegex.test(email)){
    res.render('auth/signup', {error: 'Your email needs to be of a valid format, e.g. hello@moods.com'})
    return
  }
  if(!passRegex.test(password)){
    res.render('auth/signup', {error: 'For security reasons, your password has to include 1. more than 9 characters 2. at least one number 3. at least one special character.'})
    return
  }

  // check if username is unique
  UserModel.findOne({username})
    .then((username) => {
      if (username){
        res.render('auth/signup',{error:`Sorry, the username ${username.username} is already used by someone else. Please choose another one.`})
        return 
      }
    })
    .catch(() => {
      next()
    })

  UserModel.create({username, email, password: securePW})
    .then(() => {
      res.redirect('/')
      return
    })
    .catch((err) => {
      next(err)
    })
})

// create custom middleware for authentication
 checkAuthStat = (req, res, next) => 
req.session.loggedInUser ? next() : res.redirect('/') //made a ternaryoperator 


router.get('/profile', checkAuthStat, (req, res, next) => {
  if(req.session.loggedInUser.mainUser == false){
    const loved = true}
    res.render('auth/profile', {name: req.session.loggedInUser.username,})
})

router.get('/add-loved-one', (req, res, next) => {
  res.render('auth/add-loved-one')
})

router.post('/add-loved-one', (req, res, next) => {
  const {username, password, email} = req.body; 
  const mailRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  const passRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
  const salt = bcrypt.genSaltSync(12) 
  const securePW = bcrypt.hashSync(password, salt)

  if(!username || !password){
    res.render('auth/signup.hbs', {error: 'please fill in all fields',})
    return
  }

  if(!mailRegex.test(email)){
    res.render('auth/signup', {error: 'Your email needs to be of a valid format, e.g. hello@moods.com'})
    return
  }
  if(!passRegex.test(password)){
    res.render('auth/signup', {error: 'For security reasons, your password has to include 1. more than 9 characters 2. at least one number 3. at least one special character.'})
    return
  }

  // check if username is unique
  UserModel.findOne({username})
    .then((username) => {
      if (username){
        res.render('auth/signup',{error:`Sorry, the username ${username.username} is already used by someone else. Please choose another one.`})
        return 
      }
    })
    .catch(() => {
      next()
    })

  UserModel.create({username, email, password: securePW, mainUser: false})
    .then(() => {
      res.redirect('/')
      return
    })
    .catch((err) => {
      next(err)
    })
})

module.exports = router;
