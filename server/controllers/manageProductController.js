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
    if(req.session.isLoggedIn === true) {
      connection.query('SELECT * FROM themobilehour.product', (err, results) => {
        // When done with the connection, release it
        if (!err) {
          console.log(`username: ${req.session.usernameLoggedIn}`)
          res.render('partials/manageProduct', {results});
        } else {
          console.log(err);
        }
      });
    } else {
      res.redirect('/login');
    }
  }

// Selects and displays product to be updated
exports.edit = (req, res) => {
    connection.query('SELECT * FROM themobilehour.product CROSS JOIN themobilehour.feature ON product.feature_id = feature.feature_id WHERE product_id = ?', [req.params.id], (err, results) => {
      // When done with the connection, release it
      if (!err) {
        res.render('partials/updateProduct', {results});
      } else {
        console.log(err);
      }
      console.log('The data from user table: \n', results);
    });
}




// Updates selected product
exports.update = (req,res) => {
  const { product_name, product_model, manufacturer, price, stock_on_hand, weight, dimensions, OS, screensize, resolution, CPU, RAM, storage, battery, rear_camera, front_camera } = req.body;
  // First query updates changes to "product" table
  connection.query(
    'UPDATE themobilehour.product SET product_name = ?, product_model = ?, manufacturer = ?, price = ?, stock_on_hand = ? WHERE product_id = ?', 
    [product_name, product_model, manufacturer, price, stock_on_hand, req.params.id], (err, rows) => {
    
      if (err) {
        console.log(err);
        res.render('partials/updateProduct', { alert: 'Failed to update.' });
        return;
      }
      // Second query selects "feature_id" from product to be updated
      connection.query(
        `SELECT feature_id FROM themobilehour.product WHERE product_id = ?`,
        [req.params.id],
        (err, rows) => {
          if(err) {
            console.log(err);
            res.render('partials/updateProduct', { alert: 'Failed to update.' });
            return;
          }
          console.log(`feature_id = ${rows[0].feature_id}`);
          const featureId = rows[0].feature_id;
            // Third query updates values to "feature" table
            connection.query(
              `UPDATE themobilehour.feature SET weight = ?, dimensions = ?, OS = ?, screensize = ?, resolution = ?, CPU = ?, RAM = ?, storage = ?, battery = ?, rear_camera = ?, front_camera = ? WHERE feature_id = ${featureId}`
              , [weight, dimensions, OS, screensize, resolution, CPU, RAM, storage, battery, rear_camera, front_camera, req.params.id], (err, rows) => {
                if (err) {
                  console.log(err);
                  res.render('partials/updateProduct', { alert: 'Failed to update.' });
                  return;
                }
                // create a new Date object with the current date and time
                const currentDate = new Date();
                // create an SQL INSERT statement with the formatted date string
                const formattedDate = currentDate.toISOString().substring(0, 10);
                console.log(formattedDate);
                // 4th query adds new entry in changelog
                connection.query(
                  `INSERT INTO themobilehour.changelog SET date_created = '${formattedDate}', date_last_modified = '${formattedDate}', user_id = ${req.session.userId}, product_id = ?`,
                  [req.params.id]
                  )
              res.redirect('/manageProduct');
            }); 
        }
      )
  });
}




// display form
exports.form = (req, res) => {
    res.render('partials/addProduct');
}

//   add product
exports.create = (req, res) => {
    console.log(req.body);
    const { product_name, product_model, manufacturer, price, stock_on_hand, weight, dimensions, OS, screensize, resolution, CPU, RAM, storage, battery, rear_camera, front_camera } = req.body;
  
    // Use the connect - queries are all nested seen they are async
    // The first query inserts values to the "feature" tables 
    connection.query(
      'INSERT INTO themobilehour.feature SET weight = ?, dimensions = ?, OS = ?, screensize = ?, resolution = ?, CPU = ?, RAM = ?, storage = ?, battery = ?, rear_camera = ?, front_camera = ?',
      [weight, dimensions, OS, screensize, resolution, CPU, RAM, storage, battery, rear_camera, front_camera],
      (err, rows) => {
        if (err) {
          console.log(err);
          res.render('partials/addProduct', { alert: 'Failed to add feature.' });
          return;
        }
        console.log('The data from feature table: \n', rows);
  
        // Second query grabs the 'feature_id' value from the most recent addition to the 'feature' table
        connection.query(
          'SELECT feature_id FROM themobilehour.feature ORDER BY feature_id DESC LIMIT 1',
          (err, rows) => {
            if (err) {
              console.log(err);
              res.render('partials/addProduct', { alert: 'Failed to retrieve feature ID.' });
              return;
            }
  
            const featureId = rows[0].feature_id;
            
            // Third query insert values to the 'product' table, including the 'featureId' grabbed in the previous query
            connection.query(
              'INSERT INTO themobilehour.product SET product_name = ?, product_model = ?, manufacturer = ?, price = ?, stock_on_hand = ?, feature_id = ?',
              [product_name, product_model, manufacturer, price, stock_on_hand, featureId],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  res.render('partials/addProduct', { alert: 'Failed to add product.' });
                  return;
                }
                console.log(`user that added this item was ${req.session.usernameLoggedIn}`);
                // create a new Date object with the current date and time
                const currentDate = new Date();
                // create an SQL INSERT statement with the formatted date string
                const formattedDate = currentDate.toISOString().substring(0, 10);
                console.log(formattedDate);
                // 4th query identifies product_id value from new product created
                connection.query(
                  'SELECT product_id FROM themobilehour.product ORDER BY product_id DESC LIMIT 1', (err,row) => {
                    // 5th query adds new entry in changelog
                    connection.query(
                      `INSERT INTO themobilehour.changelog SET date_created = '${formattedDate}', date_last_modified = '${formattedDate}', user_id = ${req.session.userId}, product_id = ${row[0].product_id}`
                    )
                  }
                )
                res.render('partials/addProduct', { alert: 'Product added successfully.' });
              }
            );
          }
        );
      }
    );
  };


// delete product
exports.delete = (req, res) => {
    // First query selects the feature_id from the product to be deleted
    connection.query(
        'SELECT feature_id FROM themobilehour.product WHERE product_id = ?', [req.params.id], (err,rows) => {
            if (err) {
                console.log(err);
            }
            const featureId = rows[0].feature_id;
            console.log(featureId);
        
        // Second query deletes the selected products
        connection.query(
            'DELETE FROM themobilehour.product WHERE product_id = ?', [req.params.id], (err, rows) => {
                if (err) {
                    console.log(err);
                    res.render('partials/manageProduct', { alert: 'Failed to delete product.' });
                    return;
                }
                
                // Third query deletes the feature correspondent to the deleted product
                connection.query(
                    `DELETE FROM themobilehour.feature WHERE feature_id = ${featureId}`, (err, rows) => {
                        if (err) {
                            console.log(err);
                            res.render('partials/manageProduct', { alert: 'Failed to delete product.' });
                            return;
                        }
                        
                        res.redirect('/manageProduct');
                    }
                )

            }
        )
    }
)}