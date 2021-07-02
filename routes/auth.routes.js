const router = require("express").Router();
const User = require("../models/User.model");
const bcrypt = require('bcryptjs')

//GET logout
router.get("/logout", (req, res, next) => {
  req.session.destroy();
  req.app.locals.loggedIn = false;
  res.redirect("/");
});

//GET login (which is on home screen)
router.get("/", (req, res, next) => {
  res.render("index");
});

//POST login  (also on home screen)
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


/*       

//GET signup
router.get('/signup', (req,res,next)=>{
    res.render('auth/signup')
})

//POST signup
router.post('/signup', (req, res, next)=> {
//grab username & password from form
const {username, password} = req.body;

//check if username & password both entered
if(!username || !password){

    res.render('Please enter a username and password')
}
//check if username is unique
User.findOne({username})
.then((username)=> {
    res.render(`Sorry, the username ${username} is already used by someone else.`)
}


//hash passwort. with salt & regex
//grab data & create new User with that data in db

)

})
*/

//create custom middleware for authentication
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
