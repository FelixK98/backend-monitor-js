const fs = require('fs').promises;
const client = require('../model/RedisSession');

const system_session = {};

system_session.checkSession = async (req, res, next) => {
  if (req.url.includes('/auth')) {
    next();
  } else {
    const userInfoTest = await client.get(req.user);
    if (userInfoTest) {
      next();
    } else {
      res.json(['YOU ARE NOT AUTHORIZED']);
    }
    // let userList = await fs.readFile('userInSession.json', 'utf-8');
    // userList = JSON.parse(userList);
    // const userInfo = userList.find((item) => item.sessionID === req.user);
    // if (userInfo) {
    //   next();
    // } else {
    //   res.json(['YOU ARE NOT AUTHORIZED']);
    // }
  }
};

module.exports = system_session;
