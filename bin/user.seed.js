//steps to follow:

const { Mongoose, connection } = require('mongoose')

//MAKE THE CONNECTION TO DB

require('../db')

//REQUIRE MODEL & INSERT DATA
const User = require('../models/User.model')


//either we already have data ready to insert OR we need to fetch data from API to insert. Then:
//const axios = require('axios)
//axios.request('INSERT URL HERE')
 /*   .then((response)=>{
      
      return User.insertMany(response.data)
 })
      .then(()=> {
       mongoose.connection.close

      }) 

    .catch((error)=>{
     res.render(error.response)     //!!!! API errors inside response key

    })*/

    //when we use axios: data from API always inside response object's key 'data'! That's part of axios' syntax



//CLOSE THE CONNECTION
connection.Mongoose.close