const express = require('express');
const router = express.Router();
const manageUsersController = require('../controllers/manageUsersController');

// Routes

router.get('/manageUsers', manageUsersController.view);
router.get('/manageUsers/updateUser/:id', manageUsersController.edit);
router.post('/manageUsers/updateUser/:id', manageUsersController.update);
router.get('/manageUsers/addUser', manageUsersController.form);
router.post('/manageUsers/addUser/', manageUsersController.create);
router.get('/manageUsers/:id',manageUsersController.delete);

  
module.exports = router;