const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs')

//_________LOGOUT_______________________________________________
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.app.locals.loggedIn = false;
  res.redirect("/");
  res.render('You are now logged out.')
});

//______GET LOGIN________________________________________________________________
router.get("/", (req, res, next) => {
  res.render("index");
});

//______POST LOGIN__________________________________________________________
router.post("/", (req, res, next) => {
  //question: also email as (mandatory) signin form value?
  const { username, password } = req.body;

  //check if username && password both entered   //else. flash error message
  if (!username || !password) {
    res.render("Please enter your username and password to continue");
    return; //why do we need to do that again?
  }

  User.findOne({ username }) //only if we keep username unique. else use object id

    .then((user) => {
      //hier YANIS FRAGEN OB ZWISCHENSCHRITT

      let comparedPassword = bcrypt.compareSync(password, user.password);

      if (comparedPassword) {
        req.session.loggedInUser = user;
        req.session.locals.isLoggedin = true;
        res.redirect("/profile");
      } //else:  passwort reset option. show reset form with confirm new password stuff
      else {
        res.render("index", {
          error:
            "Sorry, this passwort does not exist. You can easily reset it here.",
        });                                    //on "here"->link to reset-password-view?
      }
    })
    .catch(() => {
      res.render("index", {
        error: "We are sorry. This username does not exist",
      }); //if username forgotten --> we need email to reset..?
    });
});



router.get('/profile', (req,res,next)=>{

    res.render('auth/profile')

})


  

//_____GET signup_____________________________________________
router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
})

//_______POST signup___________________________________________
router.post('/signup', (req, res, next)=> {
//grab username & password from form
const {username, password, email} = req.body;    

//check if username & password both entered
if(!username || !password ||!email){       

    res.render('auth/signup', {error: 'Please enter a username and password'})
    return
}

//check if valid email____ONLY IF WE USE EMAIL IN OUR FORM
const mailRegex= /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
if(!mailRegex.test(email)){

res.render('auth/signup', {error: 'Your email needs to be of a valid format, e.g. hello@mail.com'})
return

}

//checks password strength
const passRegex =  /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
if(!passRegex.test(password)){

  res.render('auth/signup', {error: 'For security reasons, your password has to include 1. more than 9 characters 2. at least one number 3. at least one special character.'})
  return
}


//check if username is unique
User.findOne({username})
.then((username)=> {
    res.render('auth/signup',{error:`Sorry, the username ${username} is already used by someone else. Please choose another one.`})
})

.catch((username, email, password)=> {
const salt = bcrypt.genSaltSync(12) 
const securePW = bcrypt.hashSync(password, salt)

User.create({username, email, password: securePW})
.then(()=> {

res.redirect('/')
res.render('Thanks for registering. You can now log in.')

})
.catch((err)=> {

 next(err)

})
})

})


//_____custom middleware for authentication_______
function checkAuthStat(req, res, next){
if(req.session.loggedInUser){
    next()
} else {
    res.redirect('/')
}

}


router.get('/profile', checkAuthStat, (req, res, next)=>{

    res.render('auth/profile', {name: req.session.loggedInUser.username})
})

module.exports = router;
