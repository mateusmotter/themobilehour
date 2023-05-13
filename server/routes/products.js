const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Routes
router.get('/product/:id', productController.view);
router.get('/higher', productController.viewByHigher);
router.get('/lower', productController.viewByLower);
router.get('/filter/:manufacturer', productController.viewByBrand);

  
module.exports = router;