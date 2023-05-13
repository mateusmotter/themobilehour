const express = require('express');
const router = express.Router();
const manageProductController = require('../controllers/manageProductController');

// Routes
router.get('/manageProduct', manageProductController.view);
router.get('/manageProduct/updateProduct/:id', manageProductController.edit);
router.post('/manageProduct/updateProduct/:id', manageProductController.update);
router.get('/manageProduct/addProduct', manageProductController.form);
router.post('/manageProduct/addProduct/', manageProductController.create);
router.get('/manageProduct/:id',manageProductController.delete);
  
module.exports = router;