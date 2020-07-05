const { QueryTypes } = require('sequelize');
const db = require('../model/db');
signature = {};
signature.showAllSignature = async (req, res) => {
  const data = await db.query(
    'select signature.sig_name, sig_class.sig_class_name from signature, sig_class where signature.sig_class_id = sig_class.sig_class_id  and signature.sig_name like "%ATTACK%"',
    {
      type: QueryTypes.SELECT,
    }
  );
  res.json(data);
};

signature.getTopSignature = async (req, res) => {
  const data = await db.query(
    'SELECT  count(signature.sig_name) as count, signature.sig_name as signame FROM event,signature where event.signature = signature.sig_id group by signature.sig_name ORDER BY count(signature.sig_name) desc LIMIT 10',
    {
      type: QueryTypes.SELECT,
    }
  );
  const totalCount = data
    .map((item) => item.count)
    .reduce((total, count) => total + count);
  const newTopSig = data.map((item) => {
    const ratio = item.count / totalCount;
    if (ratio < 0.05) {
      return { ...item, color: 'primary', ratio };
    } else if (ratio < 0.1) {
      return { ...item, color: 'success', ratio };
    } else if (ratio < 0.15) {
      return { ...item, color: 'warning', ratio };
    } else if (ratio < 0.2) {
      return { ...item, color: 'danger', ratio };
    }
    return item;
  });

  res.json(newTopSig);
};

module.exports = signature;
