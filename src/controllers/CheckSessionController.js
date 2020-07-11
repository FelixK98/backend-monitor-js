const fs = require('fs').promises;

const system_session = {};

system_session.checkSession = async (req, res, next) => {
  console.log(req.user);
  if (req.url.includes('/auth')) {
    next();
  } else {
    let userList = await fs.readFile('userInSession.json', 'utf-8');
    userList = JSON.parse(userList);
    if (req.user && userList.includes(req.user.email)) {
      next();
    } else {
      res.json(['YOU ARE NOT AUTHORIZED']);
    }
  }
};

module.exports = system_session;
