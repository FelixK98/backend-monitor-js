const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const client = require('../model/RedisSession');
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
  let result = {
    user_type: 'guest',
  };

  let userInfo = await client.get(req.user);
  userInfo = JSON.parse(userInfo);

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
auth.checkUser = async (email) => {
  const query = `SELECT isAdmin FROM account where email='${email}'`;
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });

  return { isAdmin: !!data[0].isAdmin, isValid: data.length > 0 };
};
auth.getOnlineAccount = async (req, res) => {
  const query = 'SELECT * FROM account';
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });
  // file = await fs.readFile('userInSession.json', 'utf-8');
  // file_data = JSON.parse(file);
  // const onlineUserList = file_data.map((item) => item.email);
  const klist = await client.keys('*');

  const emailList = new Set();
  for (let i = 0; i < klist.length; i++) {
    let session = await client.get(klist[i]);

    emailList.add(JSON.parse(session).email);
  }

  const result = data.map((account) => {
    return {
      ...account,
      isOnline: emailList.has(account.email),
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
