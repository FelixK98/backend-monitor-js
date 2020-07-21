const passport = require('passport');
authController = require('../controllers/AuthController');
const fs = require('fs').promises;
const auth = require('../controllers/AuthController');
const client = require('../model/RedisSession');
express = require('express');
router = express.Router();

router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  res.redirect('/');
});

router.get('/logout', async (req, res) => {
  console.log('---in logout----');

  await client.del(req.user);
  req.logout();

  res.redirect('/');
});

router.get('/current_user', authController.getUserInfo);
router.get('/online_account', authController.getOnlineAccount);
router.get('/addAccount/:email', authController.addAccount);

// router.get('/:email', authController.getAuthInfo);

module.exports = router;
