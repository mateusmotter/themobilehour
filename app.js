
const express = require('express');
const session = require('express-session');
const mysql = require('mysql');
const app = express();

// set up middleware to parse data.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// set up session middleware
app.use(session({
  secret: 'secretMobile',
  resave: false,
  saveUninitialized: true,
}));

//set up EJS to use "public" folder for resources
const path = require('path');
app.use(express.static(path.join(__dirname, 'public')));

// create connection to mysql database
const connection = mysql.createConnection({
  host: 'LocalHost',
  user: 'root',
  password: 'mateus1993',
  connectionLimit: 10
});

// connect to database
connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database!');
});

// set up EJS as the templating engine
app.set('view engine', 'ejs');

// create route for displaying products
app.get('/', (req, res) => {
  // fetch products from database
  connection.query('SELECT * FROM themobilehour.product', (err, results) => {
    if (err) {
      console.error('Error fetching products:', err);
      return;
    }
    // render the template with the fetched products
    res.render('layouts/main', {results}); 
  });
});



const routes = require('./server/routes/products');
app.use('/', routes)

const routes2 = require('./server/routes/manageProduct');
app.use('/', routes2)

const routes3 = require('./server/routes/userLogin');
app.use('/', routes3)

const routes4 = require('./server/routes/manageUsers');
app.use('/', routes4)

const routes5 = require('./server/routes/changeLog');
app.use('/', routes5)

// start server
app.listen(3000, () => {
  console.log('Server started on port 3000!');
});