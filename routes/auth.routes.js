const router = require("express").Router();
const UserModel = require("../models/User.model");
const MoodModel = require("../models/Mood.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


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

  UserModel.findOne({ username })
    .then((user) => {
        if(user.status !=='Active'){
          res.render("index", {error: 'Please confirm your account first'})
          return 
      }
      if (user) {
        const comparedPassword = bcrypt.compareSync(password, user.password);
        if (comparedPassword) {
          req.session.loggedInUser = user;
          req.app.locals.isLoggedin = true;
          res.redirect("/profile");
          return
        }
      }
      else
        res.render("index", {error: 'wrong password or username'})
    })
    .catch((err) => {
      res.render("index", {error: 'wrong password or username'})
    });



});

// UserModel.findOne({ username })
//     .then((user) => {
//   if(!status =='Active'){
//     return 
// }

//_____________GET signup_____________
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//_____________POST signup____________
router.post('/signup', (req, res, next) => {
  const {username, password, email} = req.body; 
  const mailRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;   
  const passRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
  const salt = bcrypt.genSaltSync(12) 
  const securePW = bcrypt.hashSync(password, salt)

  if(!username || !password){
    res.render('auth/signup.hbs', {error: 'please fill in all fields'})
    return
  }

  if(!mailRegex.test(email)){
    res.render('auth/signup', {error: 'Your email needs to be of a valid format, e.g. hello@moods.com'})
    return
  }
  if (!passRegex.test(password)) {
    res.render("auth/signup", {error: "For security reasons, your password has to include at least 9 characters, at least one number, at least one special character."});
    return;
  }

  //check if username is unique
  UserModel.findOne({ username })
    .then((username) => {
      if(username){
        res.render("auth/signup", {error: `Sorry, the username ${user.username} is already used by someone else. Please choose another one.`});
        return
      }
    })
    .catch(() => {
      next();
    });


  //route to send confirmation mail when signup posted
  const confirmationCode = randomstring.generate(20); 
  const message = `Dear new community member, this is to confirm your MOODS account. Please click on the following URL to verify your account: https://m00ds.herokuapp.com/auth/confirm/${confirmationCode} See you soon,Your MOODS team :)`;
  // let { email, username } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.NM_USER,     
      pass: process.env.NM_PASSWORD, 
    },
  });
  transporter
    .sendMail({
      from: '"MOODS" <hello.team.moods@gmail.com>',
      to: email,
      subject: "Welcome to MOODS- Please confirm your account",
      text: message,
      html: `<b>${message}</b>`,
    })
  .then(() => {
  UserModel.create({ username, email, password: securePW, confirmationCode, status: "Pending confirmation"})
    .then(() => {
      res.redirect("/");
    })
  })
 .catch((err) => {
      console.log(err)
      res.render('auth/signup', {error: 'Sorry, something went worng. Please sign up again.'})
    });
});



//create custom middleware for authentication
const checkAuthStat = (req, res, next) => {
  req.session.loggedInUser ? next() : res.redirect("/")
}
  
router.get("/profile", checkAuthStat, (req, res, next) => {
    res.render("auth/profile", { name: req.session.loggedInUser.username });
  });

router.get("/auth/confirm/:confirmationCode",(req, res, next) => {
  UserModel.findOneAndUpdate({confirmationCode: req.params.confirmationCode}, {status: 'Active'})
    .then(()=> {
      res.redirect('/')
    })
    .catch((err)=> {
      next(err)
    })

  })

router.get('/profile', checkAuthStat, (req, res, next) => {
  if(req.session.loggedInUser.mainUser == false){
    const loved = true}
    res.render('auth/profile', {name: req.session.loggedInUser.username})
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

  module.exports = router
