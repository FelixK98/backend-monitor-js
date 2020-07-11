const express = require('express');
const router = express.Router();
const checkSessionController = require('../controllers/CheckSessionController');

router.use('/', checkSessionController.checkSession);

module.exports = router;
