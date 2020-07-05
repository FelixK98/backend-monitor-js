const passport = require('passport');
authController = require('../controllers/AuthController');
var fs = require('fs');
express = require('express');
router = express.Router();
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get(
  '/google/callback',
  passport.authenticate('google'),
  async (req, res) => {
    await fs.readFile('userInSession.json', 'utf-8', async (err, file) => {
      let file_data = JSON.parse(file);
      file_data.push(req.user.email);
      await fs.writeFile(
        'userInSession.json',
        JSON.stringify(file_data),
        (err, file) => {
          res.redirect('/');
        }
      );
    });
  }
);

router.get('/logout', async (req, res) => {
  await fs.readFile('userInSession.json', 'utf-8', async (err, file) => {
    let file_data = JSON.parse(file);
    file_data = file_data.filter((item) => item != req.user.email);
    await fs.writeFile(
      'userInSession.json',
      JSON.stringify(file_data),
      (err, file) => {
        req.logout();
        res.redirect('/');
      }
    );
  });
});

router.get('/current_user', authController.getUserInfo);
router.get('/online_account', authController.getOnlineAccount);
router.get('/addAccount/:email', authController.addAccount);

// router.get('/:email', authController.getAuthInfo);

module.exports = router;
