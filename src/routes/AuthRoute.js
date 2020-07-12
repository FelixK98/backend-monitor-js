const passport = require('passport');
authController = require('../controllers/AuthController');
const fs = require('fs').promises;
const auth = require('../controllers/AuthController');

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
  const file = await fs.readFile('userInSession.json', 'utf-8');
  let file_data = JSON.parse(file);
  file_data = file_data.filter((item) => item.sessionID != req.user);
  await fs.writeFile('userInSession.json', JSON.stringify(file_data));
  req.logout();
  res.redirect('/');
});

router.get('/current_user', authController.getUserInfo);
router.get('/online_account', authController.getOnlineAccount);
router.get('/addAccount/:email', authController.addAccount);

// router.get('/:email', authController.getAuthInfo);

module.exports = router;
