// Import the express lirbary
const express = require('express')
const session = require('express-session');
const cors = require('cors');
//const nodemailer = require('nodemailer');
//const bodyParser = require('body-parser');


require('dotenv').config();


const db_support = require('./db_support');
const passport = require('./google_oauth2');

const indexRoutes = require('./routes/index');
const authRoutes = require('./routes/auth');
const mailRoutes = require('./routes/mail');

const path = require('path'); 
const fs = require('fs');

// Import the axios library, to make HTTP requests
const axios = require('axios')


// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express()

const LOCAL_PORT = process.env.DEFAULT_LOCAL_PORT;
const PORT = process.env.PORT || LOCAL_PORT;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

//app.use(express.static(__dirname + '/public'))
//app.use(express.static(__dirname + '/src'))

app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRoutes);
app.use('/', authRoutes);
app.use('/', mailRoutes);


// Start the server
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})
