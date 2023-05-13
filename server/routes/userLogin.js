const express = require('express');
const router = express.Router();
const userLoginController = require('../controllers/userLoginController');

// Routes
router.get('/login', userLoginController.view);
router.post('/login', userLoginController.login);
  
module.exports = router;