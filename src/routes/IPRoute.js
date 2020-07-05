ipController = require('../controllers/IPController');

express = require('express');
router = express.Router();

router.get('/getCulpritDetail/:signame', ipController.getCulprit);
router.get('/statistic/src/local', ipController.getLocalSourceIpStatistic);
router.get('/statistic/dst/local', ipController.getLocalDestinationIpStatistic);
router.get(
  '/statistic/src/external',
  ipController.getExternalSourceIpStatistic
);
router.get('/statistic/dst/external', ipController.getExternalDstIpStatistic);
router.get(
  '/getCulpritByVictimAndPriority/:priority/:ip',
  ipController.getCulpritByVictimAndPriority
);
router.get('/getCulpritDetail/:signame/:ip', ipController.getCulpritByIPAndSig);

router.get('/statistic/:ip', ipController.getSignatureStatisticByIP);
router.get('/alert/:ip', ipController.getNodeAlertCurDate);
router.get('/status/:ip', ipController.getIpStatus);

router.get('/dst/:ip', ipController.getDestinationIPS);
router.get('/src/:ip', ipController.getSourceIPS);

module.exports = router;
