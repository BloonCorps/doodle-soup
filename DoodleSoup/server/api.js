/*
|--------------------------------------------------------------------------
| api.js -- server routes
|--------------------------------------------------------------------------
| This file defines the routes for your server.
*/
const express = require("express");
// import models so we can interact with the database
const User = require("./models/user");
const Drawing = require("./models/drawing")

// import authentication library
const auth = require("./auth");

// api endpoints: all these paths will be prefixed with "/api/"
const router = express.Router();

//initialize socket
const socketManager = require("./server-socket");

//3 User authentication functions below
router.post("/login", auth.login);
router.post("/logout", auth.logout);
router.get("/whoami", (req, res) => {
  if (!req.user) {
    // not logged in
    return res.send({});
  }
  res.send(req.user);
});

router.get("/user", (req, res) => {
  User.findById(req.query.userid).then((user) => {
    res.send(user);
  });
});

router.post("/initsocket", (req, res) => {
  // do nothing if user not logged in
  if (req.user) socketManager.addUser(req.user, socketManager.getSocketFromSocketID(req.body.socketid));
  res.send({});
});

// |------------------------------|
// | write your API methods below!|
// |------------------------------|

// // TODO: needs to be connected to auth 
// router.get("/drawings", (req, res) => {
//   // Drawing.find({}).then((drawings) => res.send(drawings));
// });

//finds the work of specific authors for use on account page
router.get("/works", (req, res) => {
  Drawing.find({ creator_id: req.query.userId }).then((drawings) => {
    res.send(drawings);
  });
});

//find image by Id
router.get("/image", (req, res) => {      
  Drawing.find({ _id: req.query.imageId}).then((drawings) => {
    //technically only 1 drawing but i dont want to rename and break code
    res.send(drawings);
  });
});

//finds a certain post and deletes it
router.post("/delete", (req, res) => {
  Drawing.deleteOne({_id: req.body.imageId}).then((err) => {
    console.log("Deletion executed");
  });
});

//finds all works for display on feed page
router.get("/allworks", (req, res) => {
  Drawing.find().then((drawings) => {
    res.send(drawings);
  });
});

//Saves the drawing to mongoDB
router.post("/work", (req, res) => {
  const newDrawing = new Drawing({
    creator_name: req.body.creator_name,
    creator_id: req.body.creator_id, 
    source: req.body.source,
  });
  newDrawing.save().then((drawing) => res.send(drawing));
});

//used to update images
router.post("/updateimage", (req, res) => {
  Drawing.findOne({_id: req.body.imageId}).then((drawing) => {
  drawing.source = req.body.source;
  drawing.save()
  });
});

// anything else falls to this "not found" case
router.all("*", (req, res) => {
  console.log(`API route not found: ${req.method} ${req.url}`);
  res.status(404).send({ msg: "API route not found" });
});

module.exports = router;
