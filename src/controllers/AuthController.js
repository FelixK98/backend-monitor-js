const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const auth = {};
var fs = require('fs');
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
  if (req.user) {
    result.user_type = 'invalid';
    const query = `SELECT * FROM account where email='${req.user.email}'`;
    const data = await db.query(query, {
      type: QueryTypes.SELECT,
    });
    if (data.length > 0) {
      user_type = 'valid';
      await db.query(
        `UPDATE account SET img = '${req.user.photo}' WHERE email = '${req.user.email}'`,
        { type: QueryTypes.UPDATE }
      );
      result = {
        user_type,
        ...req.user,
        isAdmin: !!data[0].isAdmin,
      };
    }
  }
  res.json(result);
};

auth.isUserInDB = async (req, res) => {
  let result = false;
  const query = `SELECT * FROM account where email='${req.user.email}'`;
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });
  if (data.length > 0) {
    result = true;
  }
  return result;
};
auth.getOnlineAccount = async (req, res) => {
  const query = 'SELECT * FROM account';
  const data = await db.query(query, {
    type: QueryTypes.SELECT,
  });
  fs.readFile('userInSession.json', 'utf-8', (err, file) => {
    file_data = JSON.parse(file);
    const result = data.map((account) => {
      return {
        ...account,
        isOnline: file_data.includes(account.email) ? true : false,
      };
    });
    res.json(result);
  });
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
    // console.log('--------------------------------');
    // console.log(err);
  }

  res.json(result);
};
auth.checkSession = (req, res, next) => {
  // console.log(req.user);
  next();
};
module.exports = auth;
