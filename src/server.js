// Import the express lirbary
const express = require('express')
const bodyParser = require('body-parser');
const session = require('express-session');
const nodemailer = require('nodemailer');
const cors = require('cors');


require('dotenv').config();



const LOCAL_PORT = 5001;
const PORT = process.env.PORT || LOCAL_PORT;

const db_support = require('./db_support');

const path = require('path'); 
const fs = require('fs');

// Import the axios library, to make HTTP requests
const axios = require('axios')






// Create a new express application and use
// the express static middleware, to serve all files
// inside the public directory
const app = express()

app.use(express.static('public'));

app.use(express.static(__dirname + '/public'))
app.use(express.static(__dirname + '/src'))

app.use(express.urlencoded({ extended: true }));
//app.use(session({ secret: 'Peroconrespeto', resave: false, saveUninitialized: false }));
//app.use(passport.initialize());
//app.use(passport.session());

//app.set('view engine', 'ejs');

app.use(cors());
app.use(express.json());

// Ruta para la página "hello world" (index.html)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});


// Start the server on port 8080
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
})
