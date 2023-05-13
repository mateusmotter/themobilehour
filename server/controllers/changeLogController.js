const express = require('express');
const mysql = require('mysql');
const app = express();

// create connection to mysql database
const connection = mysql.createConnection({
    host: 'LocalHost',
    user: 'root',
    password: 'mateus1993',
    connectionLimit: 10
});


exports.view = (req, res) => {
    // User the connection
    connection.query('SELECT * FROM themobilehour.changelog', (err, rows) => {
      // When done with the connection, release it
      if (!err) {
        res.render('partials/changeLog', {rows});
      } else {
        console.log(err);
      }
    });
  }

  exports.viewByUser = (req, res) => {
    connection.query('SELECT * FROM themobilehour.changelog WHERE user_id = ?', [req.params.id], (err,rows) => {
      if (!err) {
        res.render('partials/changeLog', {rows});
      } else {
        console.log(err);
      }
    });
  }

  exports.viewByProduct = (req, res) => {
    connection.query('SELECT * FROM themobilehour.changelog WHERE product_id = ?', [req.params.id], (err,rows) => {
      if (!err) {
        res.render('partials/changeLog', {rows});
      } else {
        console.log(err);
      }
    });
  }

exports.viewByDate = (req, res) => {
  const {start_date, end_date} = req.query;
  connection.query('SELECT * FROM themobilehour.changelog WHERE date_created BETWEEN ? AND ?', 
  [start_date, end_date], (err,rows) =>{
    if (!err) {
      res.render('partials/changeLog', {rows});
    } else {
      console.log(err);
    }
  });
}