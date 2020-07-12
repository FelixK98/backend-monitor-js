const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const auth = {};
var fs = require('fs').promises;
auth.getAuthInfo = async (req, res) => {
  const query = `SELECT * FROM account where email='${req.params.email}'`;
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });

  const jsonData = {
    isExist: data.length > 0,
    isAdmin: data.length > 0 ? !!data[0].isAdmin : false,
  };

  res.json(jsonData);
};
auth.getUserInfo = async (req, res) => {
  console.log('---in get userinfo----');

  let result = {
    user_type: 'guest',
  };
  const file = await fs.readFile('userInSession.json', 'utf-8');
  const sessionList = JSON.parse(file);
  const userInfo = sessionList.find((item) => item.sessionID === req.user);

  if (userInfo) {
    result.user_type = 'invalid';

    if (userInfo.isValid) {
      user_type = 'valid';
      await db.query(
        `UPDATE account SET img = '${req.user.photo}' WHERE email = '${req.user.email}'`,
        { type: QueryTypes.UPDATE }
      );
      result = {
        user_type,
        ...userInfo,
      };
    }
  }
  res.json(result);
};

auth.isUserInDB = async (email) => {
  let result = false;
  const query = `SELECT * FROM account where email='${email}'`;
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });
  if (data.length > 0) {
    result = true;
  }
  return result;
};
auth.isAdmin = async (email) => {
  const query = `SELECT * FROM account where email='${email}'`;
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });

  return !!data[0].isAdmin;
};
auth.getOnlineAccount = async (req, res) => {
  const query = 'SELECT * FROM account';
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });
  file = await fs.readFile('userInSession.json', 'utf-8');
  file_data = JSON.parse(file);
  const onlineUserList = file_data.map((item) => item.email);
  const result = data.map((account) => {
    return {
      ...account,
      isOnline: onlineUserList.includes(account.email) ? true : false,
    };
  });
  res.json(result);
};
auth.addAccount = async (req, res) => {
  let result = true;
  try {
    const email = req.params.email;
    const queryText = `INSERT INTO account (email) VALUES ('${email}') `;
    const data = await db.query(queryText, {
      type: QueryTypes.INSERT,
    });
  } catch (err) {
    result = false;
  }

  res.json(result);
};

module.exports = auth;
