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
    connection.query('SELECT * FROM themobilehour.product WHERE product_id = ?', [req.params.id], (err, rows) => {
      // When done with the connection, release it
      console.log(req.params.id);  
      if (!err) {
        res.render('partials/product', {rows});
      } else {
        console.log(err);
      }
    });
  }

exports.viewByBrand = (req, res) => {
  connection.query('SELECT * FROM themobilehour.product WHERE manufacturer = ?',
  [req.params.manufacturer], (err, results) => {
    if (!err) {
      res.render('layouts/main', {results});
    } else {
      console.log(err);
    }
  }
  )
}

exports.viewByLower = (req, res) => { 
  connection.query('SELECT * FROM themobilehour.product ORDER BY price ASC', (err, results) => {    
    if (!err) {
      res.render('layouts/main', {results});
    } else {
      console.log(err);
    }
  }
  )
  console.log(res);
}

exports.viewByHigher = (req, res) => { 
  connection.query('SELECT * FROM themobilehour.product ORDER BY price DESC', (err, results) => {    
    if (!err) {
      res.render('layouts/main', {results});
    } else {
      console.log(err);
    }
  }
  )
  console.log(res);
}