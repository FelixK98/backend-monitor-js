const passport = require('passport');
authController = require('../controllers/AuthController');
var fs = require('fs');
const auth = require('../controllers/AuthController');

express = require('express');
router = express.Router();
router.use('/', authController.checkSession);
router.get(
  '/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);
router.get('/google/callback', passport.authenticate('google'), (req, res) => {
  fs.readFile('userInSession.json', 'utf-8', async (err, file) => {
    let file_data = JSON.parse(file);

    file_data.push(req.user.email);
    fs.writeFile(
      'userInSession.json',
      JSON.stringify(file_data),
      (err, file) => {
        res.redirect('/');
      }
    );
  });
  // const isUserInDB = await auth.isUserInDB();
  // const isUserInDB = true;
  // if (isUserInDB) {

  // } else {
  //   res.redirect('/');
  // }
});

router.get('/logout', (req, res) => {
  fs.readFile('userInSession.json', 'utf-8', async (err, file) => {
    let file_data = JSON.parse(file);
    file_data = file_data.filter((item) => item != req.user.email);
    fs.writeFile(
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
