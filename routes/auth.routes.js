const router = require('express').Router();    



//GET logout
router.get('/logout', (req, res, next)=> {
req.session.destroy()
req.app.locals.loggedIn = false
res.redirect('/')

})


//GET login
router.get('/signin', (req, res, next)=> {
res.render('auth/signin')

})


//POST login
router.post('/signin', (req, res, next) => {    //question: email as a signin form value?
 const {username, password} = req.body
 
 //check if username && password both entered   //else. flash error message
if(!username || !password){
res.render('Please enter your username and password to continue')

}

 //check if username-password combination exists in database wirh User.findOne
 //if not, show reset password option


})


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






//create custom middleware just for authentication










module.exports = router;