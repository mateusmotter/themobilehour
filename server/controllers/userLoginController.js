
const express = require('express');
const mysql = require('mysql');
const app = express();
const bcrypt = require('bcrypt');

// create connection to mysql database
const connection = mysql.createConnection({
    host: 'LocalHost',
    user: 'root',
    password: 'mateus1993',
    connectionLimit: 10
});

// renders login page
exports.view = (req, res) => { 
    res.render('partials/login');
}

// posts login credentials and check against the database
exports.login = (req, res) => {
  let username = req.body.username;
  let password = req.body.user_password;
    // if username and password have been submitted it executes the query
  if (username && password) {
    connection.query(
      'SELECT * FROM themobilehour.user WHERE username = ?',
      [username],
      (err, rows) => {
        if (err) {
          console.log(err);
          res.redirect('/login');
          return;
        }
        if (rows.length === 0) {
          res.redirect('/login');
          return;
        }
        // sets up and compare password against saved hashed value, if no match, redirects to login page
        const hashedPassword = rows[0].user_password;
        bcrypt.compare(password, hashedPassword, (err, result) => {
          if (err) {
            console.log(err);
            res.redirect('/login');
            return;
          }
        // If it matches, sets up session variable that can be accessed from all pages and redirects to manageProduct page
          if (result) {
            req.session.isLoggedIn = true;
            req.session.usernameLoggedIn = username;
            req.session.role = rows[0].user_role;
            req.session.userId = rows[0].user_id;
            console.log(`Logged is ${req.session.isLoggedIn} with username: ${req.session.usernameLoggedIn} and role ${req.session.role}`);
            res.redirect('/manageProduct');
          } else {
            res.redirect('/login');
          }
        });
      }
    );
  } else {
    res.redirect('/login');
  }
};
