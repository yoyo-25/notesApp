const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");
const { parse } = require("querystring");
const { log } = require("console");
const cors = require("cors");
const app = express();
const port = 4000;
app.use(cors());
const {User, usernotes} = require("./models/userschema");

mongoose.connect("mongodb+srv://yayo25:iamatomic123@cluster0.t4zg3as.mongodb.net/mynotes")
  .then(() => console.log("connected to database"))
  .catch((err) => console.error("error connecting to database", err));


app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// app.use(express.static(path.join(__dirname, "myNotes_frontend")));

// app.get("/", (req, res) => {
//   res.sendFile(__dirname + "/myNotes_frontend/index.html");
// });
// app.get("/about", (req, res) => {
//   res.sendFile(__dirname + "/myNotes_frontend/about.html");
// });
// app.get("/login", (req, res) => {
//   res.sendFile(__dirname + "/myNotes_frontend/login.html");
// });
// app.get("/signup", (req, res) => {
//   res.sendFile(__dirname + "/myNotes_frontend/signup.html");
// });
// app.get("/mynotes", (req,res)=>{
//   res.sendFile(__dirname+"/myNotes_frontend/mynotes.html");
// })

//inserting data in database

app.post("/signupdata", async (req, res) => {
  const { username, email, password } = req.body;
  const newUser = new User({ username, email, password });

  await newUser.save()
    .then((savedUser) => {
      console.log("user saved successfully", savedUser);
      res.status(201).send({message: "user saved successfully", statusCode: 201})
    })
    .catch((err) => {
      console.log("error saving user", err);
      res.status(400).send({message: "error saving user", statusCode: 400})
    });
});

//getting data in database

app.get("/finduser", async (req, res) => {
  const email = req.params.emailId;
  try {
    const userdetails = await User.findOne({ email: email });
    if (!userdetails) {
      return res.status(404).json({ message: "user not found" });
    }
    res.send(userdetails);
  } catch (error) {
    console.error("error retrieving user", error);
    res.status(404).json({ message: "user not found" });
  }
});

//updating users data

app.put("/updatedata/:emailId", async (req, res) => {
  const email = req.params.emailId;
  const username = req.body.username;
  const password = req.body.password;
  try {
    let userdetails = await User.findOne({ email: email });
    if (!userdetails) {
      res.status(404).json({ message: "user not found" });
    }
    if (username) {
      userdetails.username = username;
    }
    if (password) {
      userdetails.password = password;
    }

    userdetails = await userdetails.save();
    res.send(userdetails);
  } catch (error) {
    console.error("error updating data", error);
    res.send("error updating data");
  }
});

//deleting data in users data base

app.delete("/deletedata/:emailId", async (req, res) => {
  const email = req.params.emailId;
  try {
    let userdetails = await User.findOneAndDelete({ email: email });

    if (!userdetails) {
      res.status(404).json({ message: "user does not exist" });
    }
    res.json({
      message: "user deleted successfully",
      deletedUser: userdetails,
    });
  } catch (error) {
    res.status(404).json({ message: "error deleting user" });
    console.error("error deleting user", error);
  }
});

//login verification

app.post("/logindata", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  try {
    const userdetails = await User.findOne({ email: email });
    if(!userdetails){
      res.status(404).send({message: "user not found", statusCode: 404})
    } else{
        if (userdetails.password === password) {
          res.status(200).send({ username: userdetails.username, email: userdetails.email, statusCode: 200 });
        } else{
          res.status(401).send({message: "wrong password", statusCode: 401})
        }
    }
  } catch (error) {
    console.error("error loging in", error);
    res.status(500).send({message: "error loging in", statusCode: 500});
  }
});

//UserNotes Manipulation

//Storing user notes and thier email

app.post('/addnotes', async (req,res)=>{
  const {email, title, notes} = req.body
  const usernotesform = new usernotes({email, title, notes})

  await usernotesform.save()
    .then(savednotes=>{
      console.log("notes saved", savednotes)
      res.status(201).send({message: "notes saved successfully", statusCode: 201})
    })
    .catch(err=>{
      console.log("error saving notes", err)
      res.status(500).send({message: "error saving userNotes", statusCode: 500})
    })

})

//getting user notes

app.get('/getnotes/:emailId', async (req,res)=>{
  const email= req.params.emailId
  console.log(email)
  try{
    const usernotesindb = await usernotes.find({email: email})
    console.log(usernotesindb)
    if(!usernotesindb){
      console.log("no notes found")
      res.status(404).send({message: "usernotes not found", statusCode: 404})
    } else{
      res.status(201).send(usernotesindb)
    }
  } catch(err){
    console.log("error fetching notes",err)
    res.status(500).send({message: "error fetching notes", statusCode: 500})
  }
})

app.listen(port, () => {
  console.log(`this app is running on https://notesapp-o3mu.onrender.com`);
});
