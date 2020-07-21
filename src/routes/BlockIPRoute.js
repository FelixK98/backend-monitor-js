blockIPController = require('../controllers/BlockIPController');

express = require('express');
router = express.Router();

router.get('/add/:ip', blockIPController.addBlockIP);
router.get('/delete/:ip', blockIPController.deleteBlockIP);
router.get('/list', blockIPController.getIPBlockList);

module.exports = router;
