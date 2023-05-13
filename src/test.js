exports.create = (req, res) => {
    console.log(req.body);
    const { product_name, product_model, manufacturer, price, stock_on_hand, weight, dimensions, OS, screensize, resolution, CPU, RAM, storage, battery, rear_camera, front_camera } = req.body;
    let searchTerm = req.body.search;
  
    // Use the connection
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
  
        connection.query(
          'SELECT feature_id FROM themobilehour.feature ORDER BY feature_id DESC LIMIT 1',
          (err, rows) => {
            if (err) {
              console.log(err);
              res.render('partials/addProduct', { alert: 'Failed to retrieve feature ID.' });
              return;
            }
  
            const featureId = rows[0].feature_id;
  
            connection.query(
              'INSERT INTO themobilehour.product SET product_name = ?, product_model = ?, manufacturer = ?, price = ?, stock_on_hand = ?, feature_id = ?',
              [product_name, product_model, manufacturer, price, stock_on_hand, featureId],
              (err, rows) => {
                if (err) {
                  console.log(err);
                  res.render('partials/addProduct', { alert: 'Failed to add product.' });
                  return;
                }
                console.log('The data from product table: \n', rows);
  
                res.render('partials/addProduct', { alert: 'Product added successfully.' });
              }
            );
          }
        );
      }
    );
  };