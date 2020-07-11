eventController = require('../controllers/EventController');

express = require('express');
router = express.Router();

router.get('/test', eventController.test);
router.get('/', eventController.showAlertTable);

router.get('/getEventByDate', eventController.getEventByDate);
router.get(
  '/getEventBySignature/:sigName',
  eventController.showAlertTableBySignature
);
router.get('/getTime/:ip/:sig', eventController.getEventByIPAndSignature);
router.get('/getTodayTraffic/:network', eventController.getTodayTraffic);
router.get(
  '/getTrafficByDate/:network/:dates',
  eventController.getTrafficByDate
);
router.get('/getPriorities', eventController.getPriorities);
router.get('/getPriorityDetail/:id', eventController.getPriorityDetail);

module.exports = router;
