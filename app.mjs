import express from 'express';
import url from 'url';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import "./db.mjs";
import fs from 'fs';
import passport from 'passport';
import jQuery from 'jquery';
import React from 'react';
import session from 'express-session';

const app = express();

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
app.use(express.static(path.join(__dirname, 'public')));

const sessionOptions = {
    secret: 'secret cookie thang (store this elsewhere!)',
    resave: true,
      saveUninitialized: true
};
app.use(session(sessionOptions));

app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT || 3000);
