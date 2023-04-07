import * as dotenv from 'dotenv';
dotenv.config();

import express from 'express';
const app = express();
app.set('view engine', 'hbs');

import mongoose from 'mongoose';
import "./db.mjs";
await mongoose.connect(process.env.DB_URL || "mongodb://localhost/cornsnake")
  .then(()=>{
    console.log("Connected to MongoDB");
  })
  .catch(()=>{
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


// Route to Homepage
app.get('/', async (req, res) => {
  const comments = await Comment.find({}).sort("-createdAt").exec();
  const user = req.user ?? undefined;
  res.render('index', {user: user, comments: comments});
});

app.post('/', async (req, res) => {
  let username;
  if (req.user) {
    username = req.user.username;
  }
  const comment = new Comment({
    username: username,
    content: req.body.comment
  })
  await comment.save();
  res.redirect('/');
})

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

// Route to Log out
app.get('/logout', function(req, res) {
  req.logout(function(err) {
    if (err) { return next(err);}
    res.redirect('/');
  });
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

