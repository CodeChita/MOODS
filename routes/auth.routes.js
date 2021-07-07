const router = require("express").Router();
const UserModel = require("../models/User.model");
const MoodModel = require("../models/Mood.model");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const randomstring = require("randomstring");


//GET logout
router.get("/logout", (req, res, next) => {
req.session.destroy();
req.app.locals.loggedIn = false;
res.redirect("/");
});

//POST login
router.post("/", (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    res.render("index.hbs", {
      error: "Please enter your username and password to continue",
    });
    return;
  }

  UserModel.findOne({ username })
    .then((user) => {
      if (user) {
        const comparedPassword = bcrypt.compareSync(password, user.password);
        if (comparedPassword) {
          req.session.loggedInUser = user;
          req.app.locals.isLoggedin = true;
          res.redirect("/profile");
        }
      } else res.render("index", { error: "wrong password or username" });
    })
    .catch((err) => {
      console.log("check");
      next(err);
    });
});

//_____________GET signup_____________
router.get("/signup", (req, res, next) => {
  res.render("auth/signup");
});

//_____________POST signup____________
router.post("/signup", (req, res, next) => {

  //grab username & password & mail from form
  const { username, password, email } = req.body;
  const mailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

  const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*]).{9,}$/;
  const salt = bcrypt.genSaltSync(12);
  const securePW = bcrypt.hashSync(password, salt);
  // //check if username & password both entered //made a ternaryoperator
  if (!username || !password) {
    res.render("auth/signup.hbs", { error: "please fill in all fields" });
    return;
  }
  if (!mailRegex.test(email)) {
    res.render("auth/signup", {
      error: "Your email needs to be of a valid format, e.g. hello@moods.com",
    });
    return;
  }
  if (!passRegex.test(password)) {
    res.render("auth/signup", {
      error:
        "For security reasons, your password has to include at least 9 characters, at least one number, at least one special character.",
    });
    return;
  }

  //check if username is unique
  UserModel.findOne({ username })
    .then((username) => {
      res.render("auth/signup", {
        error: `Sorry, the username ${user.username} is already used by someone else. Please choose another one.`,
      });
    })
    .catch((username, email, password) => {
      next();
    });

  //route to send confirmation mail when signup posted
  const confirmationCode = randomstring.generate(20); 
  const message =
  `Dear new community member, this is to confirm your MOODS account. Please click on the following URL to verify your account: http://localhost:3000/auth/confirm/${confirmationCode} See you soon,Your MOODS team :)`;
  let { email, username } = req.body;
  let transporter = nodemailer.createTransport({
    service: "Outlook",
    auth: {
      user: process.env.NM_USER,     
      pass: process.env.NM_PASSWORD, 
    },
  });
  transporter
    .sendMail({
      from: '"MOODS" <moods-hello@outlook.com>',
      to: {email},
      subject: "Welcome to MOODS- Please confirm your account",
      text: message,
      html: `<b>${message}</b>`,
    })
  .then((info) => console.log(info)) //<------------console log
  .catch((error) => console.log(error)); //<-------------------


  UserModel.create({ username, email, password: securePW, confirmationCode})
    .then(() => {
      res.redirect("/");
    })
    .catch((err) => {
      next(err);
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
    user.status == "Active";
    res.redirect('/')
  })
  .catch(()=> {


  })
})

  module.exports = router
