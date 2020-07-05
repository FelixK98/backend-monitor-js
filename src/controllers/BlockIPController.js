const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const blockController = {};
blockController.addBlockIP = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `INSERT INTO blocked_ip (ip) VALUES ('${ip}') `;
  const data = await db.query(queryText, {
    type: QueryTypes.INSERT,
  });

  res.json(data);
};
blockController.getIPBlockList = async (req, res) => {
  const queryText = 'SELECT * FROM blocked_ip ';
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });

  res.json(data);
};
module.exports = blockController;
