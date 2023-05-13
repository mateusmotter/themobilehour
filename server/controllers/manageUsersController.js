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
    // User the connection
    if(req.session.role === 'admin' || req.session.role === 'manager') {
      connection.query('SELECT * FROM themobilehour.user', (err, results) => {
        // When done with the connection, release it
        if (!err) {
          res.render('partials/manageUsers', {results});
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect('/manageProduct');
    }
  }

// Selects and displays product to be updated
exports.edit = (req, res) => {
    // checks if user has permission to update other users, than execute query.
    if(req.session.role === 'admin' || req.session.role === 'manager') {
        connection.query('SELECT * FROM themobilehour.user WHERE user_id = ?', [req.params.id], (err, results) => {
        // When done with the connection, release it
        if (!err) {
            res.render('partials/updateUser', {results});
        } else {
            console.log(err);
        }
        });
    } else {
        res.redirect('/manageUsers');
    }
}




// Updates selected product
exports.update = (req,res) => {
  const { firstname, lastname, user_role, username, user_password } = req.body;
  bcrypt.hash(user_password, 10, (err, hash) => {
    if (err) {
      console.log(err);
      res.render('partials/updateUser', { alert: 'Failed to add user.' });
      return;
    }
    // First query updates changes to "user" table
    connection.query(
      'UPDATE themobilehour.user SET firstname = ?, lastname = ?, user_role = ?, username = ?, user_password = ? WHERE user_id = ?', 
      [firstname, lastname, user_role, username, hash, req.params.id], (err, rows) => {
      
        if (err) {
          console.log(err);
          res.render('partials/updateUser', { alert: 'Failed to update.' });
          return;
        }
        res.redirect('/manageUsers');
      });
    });
}

exports.form = (req, res) => {
    if (req.session.role === 'manager') {
        res.render('partials/addUser');
    } else {
        res.redirect('/manageUsers');
    }
}

//   add product
exports.create = (req, res) => {
    const { firstname, lastname, user_role, username, user_password } = req.body;
    bcrypt.hash(user_password, 10, (err, hash) => {
      if (err) {
        console.log(err);
        res.render('partials/addUser', { alert: 'Failed to add user.' });
        return;
      }
      connection.query(
        'INSERT INTO themobilehour.user SET firstname = ?, lastname = ?, user_role = ?, username = ?, user_password = ?',
        [firstname, lastname, user_role, username, hash],
        (err, rows) => {
          if (err) {
            console.log(err);
            res.render('partials/addUser', { alert: 'Failed to add user.' });
            return;
          }
          res.redirect('/manageUsers');
        }
      );
    });
  };

  // delete product
exports.delete = (req, res) => {
    connection.query(
        'DELETE FROM themobilehour.user WHERE user_id = ?',[req.params.id], (err, rows) => {
            if (err) {
                console.log(err);
                res.render('partials/manageUsers', { alert: 'Failed to delete user.' });
                return;
            }
            res.redirect('/manageUsers');
        }
    )

}

