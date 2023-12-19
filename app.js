const express = require("express");
const bodyParser = require("body-parser")
const ejs = require("ejs")
require('dotenv').config();

const mongoose = require ("mongoose")
var encrypt = require('mongoose-encryption');

const app = express()
app.use(express.static("public"))
app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended:true}))

mongoose.connect(`mongodb+srv://${process.env.name_db}:${process.env.password_db}@cluster0.ueqgbuk.mongodb.net/UserDB?retryWrites=true&w=majority`);

const userSchema = new mongoose.Schema({
   email: String,
   password: String
});

const secret = "ThisisSecret";
userSchema.plugin(encrypt, {secret: secret, encryptedFields: ['password']});

const User = new mongoose.model("User", userSchema);

app.get("/register", (req,res)=> {
   res.render("register");
})

app.post("/register", async (req, res) => {
   const newUser = new User({
       email: req.body.username,
       password: req.body.password
   });

   try {
       await newUser.save();
       res.render("secrets");
   } catch (err) {
       console.error('Error during user registration:', err);
       res.status(500).send("Internal server error.");
   }
});
f
app.get("/login", (req,res)=> {
   res.render("login");
})

app.post("/login", async (req, res) => {
   const username = req.body.username;
   const password = req.body.password;

   try {
       const foundUser = await User.findOne({ email: username });

       if (foundUser) {
           if (foundUser.password === password) {
               res.render("secrets");
           } else {
               res.send("Incorrect Password");
           }
       } else {
           res.send("No user found with that email.");
       }
   } catch (err) {
       console.error('Error during user search:', err);
       res.status(500).send("Internal Server error");
   }
});
app.get("/secrets", (req,res)=> {
   res.render("secrets");
})

app.post("/register", (req, res) => {
   const newUser = new User ({
       email: req.body.username,
       password: req.body.password
   });

   newUser.save((err) => {
       if (err) console.log (err)
       else res.render("secrets")
   })
})

app.post("/login", (req, res)=>{

   const username = req.body.username;
   const password = req.body.password;

   User.findOne({email: username}, (err, foundUser) => {
       if (err) console.log(err)
       else {
           if (foundUser) {
               if (foundUser.password === password) res.render("secrets");
           }
       }
   });
});

app.get("/logout", (req,res)=>{
 
   res.redirect("/")
})

app.get("/", (req,res)=> {
   res.render("home");
});

app.listen (3000, () => {
   console.log("Server opened on port 3000")
})


