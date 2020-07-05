const LocalNodeController = require('../controllers/LocalNodeController');

const express = require('express');
const router = express.Router();

router.get('', LocalNodeController.getAllNodes);
router.get('/addNode', LocalNodeController.addNode);
router.get('/:network', LocalNodeController.getNodeByNetWork);
router.get('/ip/:ip', LocalNodeController.getNodeByIP);

module.exports = router;
