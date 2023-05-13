const express = require('express');
const router = express.Router();
const changeLogController = require('../controllers/changeLogController');

// Routes
router.get('/changeLog', changeLogController.view);
router.get('/changeLog/byUser/:id', changeLogController.viewByUser);
router.get('/changeLog/byProduct/:id', changeLogController.viewByProduct);
router.get('/changeLog/byDate', changeLogController.viewByDate);
  
module.exports = router;