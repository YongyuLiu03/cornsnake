import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
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

import url from 'url';
import path from 'path';
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

import bodyParser from 'body-parser';
app.use(bodyParser.urlencoded({extended: true}))

import cors from 'cors';
app.use(cors({credentials:true, origin:"http://localhost:3000"}));

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

//req.isAuthenticated()

app.get("/api/comment", async function(req, res) {
  res.json(
    await Comment.find()
      .sort({createdAt: -1})
  );
});

app.post("/api/comment", async function(req, res) {
  console.log(req.body)
  const newComment = new Comment({
    username: req.body.username,
    content: req.body.content
  })
  await newComment.save();
  res.json(newComment);
})

app.get("/api/userinfo", function(req, res) {
  console.log(req.user);
  res.json(req.user);
});

app.get("/api/logout", function(req, res) {
  req.logout(function(err) {
    if (err) { throw err;}
    res.json('ok');
  });
});

// Route to Login Page
app.get('/login', (req, res) => {
  res.render('login');
});

// Route to Dashboard
app.get('/dashboard', connectEnsureLogin.ensureLoggedIn(), (req, res) => {
  res.send(`Hello ${req.user.username}. Your session ID is ${req.sessionID} 
  and your session expires in ${req.session.cookie.maxAge} 
  milliseconds.<br><br>
  <a href="/logout">Log Out</a><br><br><a href="/secret">Members Only</a>`);
});


// Post Route: /login
app.post('/login', passport.authenticate('local', { failureRedirect: '/' }),  function(req, res) {
	console.log(req.user);
	res.redirect('/');
});

app.get("/register", function(req, res) {
  res.render('register');
});

app.post('/register', function(req, res, next) {
  console.log('registering user');
  User.register(new User({username: req.body.username}), req.body.password, function(err) {
    if (err) {
      console.log('error while user register!', err);
      return next(err);
    }
    console.log('user registered!');
    res.redirect('/');
  });
});

app.listen(process.env.PORT || 3000, () => console.log(`Listening on port ${process.env.PORT ?? 3000}`));


import fs from 'fs';

import jQuery from 'jquery';
import React from 'react';

