const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const blockController = {};
blockController.addBlockIP = async (req, res) => {
  const ip = req.params.ip;

  const queryText = `INSERT INTO blocked_ip (ip,block_time) VALUES ('${ip}', DATE_ADD(now(), INTERVAL 7 HOUR)) `;
  const data = await db.query(queryText, {
    type: QueryTypes.INSERT,
  });

  res.json(data);
};
blockController.deleteBlockIP = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `DELETE FROM blocked_ip where ip = '${ip}' `;
  const data = await db.query(queryText, {
    type: QueryTypes.INSERT,
  });

  res.json(data);
};
blockController.getIPBlockList = async (req, res) => {
  const queryText =
    'SELECT ip, convert(block_time, char) as time FROM blocked_ip ';
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });

  res.json(data);
};
module.exports = blockController;
