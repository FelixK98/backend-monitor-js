express = require('express');
router = express.Router();
signatureController = require('../controllers/signatureController');

router.get('/', signatureController.showAllSignature);

router.get('/top', signatureController.getTopSignature);
module.exports = router;
