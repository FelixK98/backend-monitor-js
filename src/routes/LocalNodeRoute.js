const LocalNodeController = require('../controllers/LocalNodeController');

const express = require('express');
const router = express.Router();

const addNoteValidate = (req, res, next) => {};

router.get('', LocalNodeController.getAllNodes);
router.get('/addNode', addNoteValidate, LocalNodeController.addNode);
router.get('/getNodeEvents/:name', LocalNodeController.getNodeEvents);
router.get('/getNodeCount/:interface', LocalNodeController.getNodeCount);
router.get('/:network', LocalNodeController.getNodeByNetWork);
router.get('/ip/:ip', LocalNodeController.getNodeByIP);

module.exports = router;
