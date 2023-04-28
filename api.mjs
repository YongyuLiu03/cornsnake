import express from 'express';

import * as dotenv from 'dotenv';
dotenv.config();

const app = express();

import mongoose from 'mongoose';
import "./db.mjs";
await mongoose.connect(process.env.DB_URL || "mongodb://localhost/cornsnake")
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch((err)=>{
    console.log(err);
    console.log("Couldn't connect to MongoDB");              
  });
const Morph = mongoose.model('Morph');
const User = mongoose.model('User');
const Comment = mongoose.model('Comment');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));


// import cors from 'cors';
// app.use(cors({credentials:true, origin:"http://localhost:3000"}));

import session from 'express-session';
import {v4 as uuidv4} from 'uuid';
const sessionOptions = {
  genid: function(req) { return uuidv4();},
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true
};
app.use(session(sessionOptions));

import passport from 'passport';
import connectEnsureLogin from 'connect-ensure-login';
app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


import mongodb, { MongoClient } from 'mongodb';
const client = new MongoClient(process.env.DB_URL, { useNewUrlParser: true, useUnifiedTopology: true });
await client.connect().catch((err) => console.log(err));
const db = client.db("dev");
const bucket = new mongodb.GridFSBucket(db);

app.get('/pics/:id', (req, res) => {
  const id = req.params.id;
  const objectId = new mongodb.ObjectId(id);
  const imageStream = bucket.openDownloadStream(objectId);

  imageStream.on('error', (err) => {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  });

  res.setHeader('Content-Type', 'image/jpeg'); // Set the content type based on your image format
  imageStream.pipe(res);
});

app.get("/comments", async function(req, res) {
  res.json(
    await Comment.find()
      .sort({createdAt: -1})
  );
});

app.post("/comments", async function(req, res) {
  const newComment = new Comment({
    username: req.user? req.user.username: "Anonymous",
    content: req.body.content
  })
  await newComment.save();
  res.json(newComment);
});

app.get("/user", function(req, res) {
  console.log(req.user);
  if (req.isAuthenticated()) {
    res.status(200).json({ user: { name: req.user.username, isLoggedIn: true } });
  } else {
    res.status(200).json({ user: { isLoggedIn: false } });
  }
});

app.get("/logout", function(req, res) {
  if (req.isAuthenticated()) {
    req.logout(function(err) {
      if (err) { throw err;}
      res.json({ message: 'Logged out successfully' });
    });
  } else {
    res.json({message: "You are not logged in"});
  }

});

app.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({ message: info.message });
    }
    req.logIn(user, function(err) {
      if (err) {
        return next(err);
      }
      return res.json(req.user);
    });
  })(req, res, next);
});

app.post('/register', function(req, res, next) {
  console.log('registering user');
  console.log(req.body)
  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      res.status(400).json({ message: 'Failed to register user', err });
      return next(err);
    }
    res.status(201).json({ message: 'User registered successfully' });
  });
});

app.post('/morphs', async (req, res) => {
  try {
    const { types, traits } = req.body;
    let filteredMorphs;
    if (types.length == 0 && traits.length == 0) {
      filteredMorphs = await Morph.find().lean();
    } else if (types.length == 0) {
      filteredMorphs = await Morph.find({
        traits: { $all: traits },
      }).lean();
    } else if (traits.length == 0) {
      filteredMorphs = await Morph.find({
        type: { $in: types },
      }).lean();
    } else {
      filteredMorphs = await Morph.find({
        type: { $in: types },
        traits: { $all: traits },
      }).lean();
    }
    res.status(200).json(filteredMorphs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



export default app;
