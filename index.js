const express = require("express");
const crypto = require('crypto');
const hash = crypto.createHash('sha256');
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const { body, validationResult } = require('express-validator');
const { RSA_NO_PADDING } = require("constants");

//the connection to our database
const MongoClient = require('mongodb').MongoClient;
const uri = `mongodb+srv://Admin:Admin@users` + 
`.fxeqf.mongodb.net/Users?retryWrites=true&w=majority`;
const client = new MongoClient(uri, 
    { useNewUrlParser: true, useUnifiedTopology: true });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//connecting to the database 
async function connectToDataBase()
{
  try {
    await client.connect();
  } catch (e) {
    console.error(e);
  } finally {
    console.log("connected to database");
  }
}

//check if username is unique in the database
async function checkIfUniqueUsername(name)
{
  result = await client.db("Users").collection("UsersInfo")
  .findOne({ username: name });

  if (result) 
    return false;
  else
    return true;
}

async function checkIfUniqueEmail(Email)
{
  //find if the email is already in use
  result = await client.db("Users").collection("UsersInfo")
  .findOne({ email: Email });

  if (result) 
    return false;
  else
    return true;
}


//add an user to the database
async function createUser(newUser){
  const result = await client.db("Users").collection("UsersInfo").insertOne(newUser);
  return true;
}


//sign up endpoint
app.post("/sign-up",[
  //username must not be empty
  body("username").notEmpty(),
  // username must be an email
  body('email').isEmail(),
  // password must be at least 8 chars long
  body('password').isLength({ min: 8 })] ,
  (req, res) => {

  let user = req.body;

  //validationResult will tell me if the username, passowrd and email are type-valid
  const errors = validationResult(req);
  if(errors.isEmpty()){
    checkIfUniqueUsername(user.username).then((rez) =>{
      if (rez === true)
      {
        checkIfUniqueEmail(user.email).then((isUnique) => {
        if (isUnique === true)
        {
          //first, we change hash the passwowrd
          user.password = hash.update(user.password).digest("hex");
          //we can add the username to the database
          createUser(user).then((ans) => {
            if(ans === true)
            {
              console.log(`User ${user.username} was created`);
              res.send("Created");
              return;
            }
          })
        }
        else
        {
          console.log("email already in database");
          res.send("Email already taken");
          return;
        }
      })
      }
      else
        {
          console.log("username not unique");
          res.send("Username already taken");
          return;
        }
    });
}
  else
    res.send(errors);
    return;
});

async function verifyLogIn(usernmae, password)
{
  result = await client.db("Users").collection("UsersInfo").findOne
                        ({username : username, password : password});
  if (result)
    return true;
  return false;
}

//sign in endpoint
app.post("/sing-in", (req, res) => {
  verifyLogIn(req.body.username, hash.update(req.body.password).digest("hex")).then(
    (ans) => {
      if (ans === true)
      {
        //do the magic token stuff
      }
      else
        res.send("Wrong username or password");
    }
  );

});

app.post("/upload-images", (req, res) =>{
  console.log("working in here");
})

//to display our webpage when doing get
app.use(express.static("assets"));

app.listen("3000", () =>{
  console.log("server started at port 3000");
  connectToDataBase();
}
);


// junk code -----------


async function listDatabases(client){

  databasesList = await client.db().admin().listDatabases();

  console.log("Databases:");
  databasesList.databases.forEach(db => console.log(` - ${db.name}`));




//   await createListing(client,        {
//     name: "Lovely Loft",
//     summary: "A charming loft in Paris",
//     bedrooms: 1,
//     bathrooms: 1
//  });
//   await findOneListingByName(client, "Lovely Loft")


};


async function findOneListingByName(client, nameOfListing) {
  result = await client.db("sample_airbnb").collection("listingsAndReviews")
                      .findOne({ name: nameOfListing });

  if (result) {
      console.log(`Found a listing in the collection with the name '${nameOfListing}':`);
      console.log(result);
  } else {
      console.log(`No listings found with the name '${nameOfListing}'`);
  }
}





// // async function connectToDb()
// // {


  
// //   try {
// //     // Connect to the MongoDB cluster
// //     await client.connect(err => {
// //       const collection = client.db("test").collection("devices");
// //       // perform actions on the collection object
// //       client.close();
// //     });

// //     // Make the appropriate DB calls
// //   let databasesList = await client.db().admin().listDatabases();
 
// //   console.log("Databases:");
// //   databasesList.databases.forEach(db => console.log(` - ${db.name}`));


// // } catch (e) {
// //     console.error(e);
// // } finally {
// //     await client.close();
// // }
 
// // }

// // connectToDb();

// // //connect the server to the database
// // var mongoDB = 'mongodb+srv://Admin:Admin@users.fxeqf.mongodb.net/Users?retryWrites=true&w=majority';
// // // var db = mongoose.connect(mongoDB, {useNewUrlParser: true});
// // //var db = mongoose.connection;



// // function connectToDb()
// // {
// //   try {
// //      mongoose.connect(mongoDB, {useNewUrlParser: true});
// //    } catch (error) {
// //      handleError(error);
// //    }
// // }

// // connectToDb();


// //making a new schema for the database 


// //get an instance of the schema builder
// var Schema = mongoose.Schema;

// //make a new schema using the instance
// var schema = new Schema(
//   {
//     name: String,
//     password: String,
//     email: String,
//     age: Number
//   }
// )

// //create a model
// var SomeModel = mongoose.model('TestModel', schema);

// //create an instance
// var instance = new SomeModel({
//   name:"Bob",
//   password:"Bob",
//   email:"Bob",
//   age: 25
// });

// //save the instance
// instance.save(function(err){
//   if (err) console.log("not stonks");
// })


// // var awesome_instance = new ({ name: 'awesome' });

// // // Save the new model instance, passing a callback
// // awesome_instance.save(function (err) {
// //   if (err) return handleError(err);
// //   // saved!
// // });


// //app.use(express.static('assets'));



// //Starting the server
// app.listen("3000", () =>{
//   let pwd = "anaAreMere";
//   pwd = hash.update(pwd).digest("hex");
//   console.log(pwd);
// }
//   );