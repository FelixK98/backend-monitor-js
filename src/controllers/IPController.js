const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const ipConnect = {};
ipConnect.getAllNodes = async (req, res) => {
  const data = await db.query('select *  from local_nodes', {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};

ipConnect.getDestinationIPS = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `select date(now()) as 'time', count(ip_dst) as count, INET_NTOA(ip_dst) as ip  from iphdr where INET_NTOA(ip_src) = '${ip}' group by(ip_dst) ORDER BY count(ip_dst) desc LIMIT 10`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};

ipConnect.getSourceIPS = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `select date(now()) as 'time', count(ip_src) as count, INET_NTOA(ip_src) as ip  from iphdr where INET_NTOA(ip_dst) = '${ip}' group by(ip_src) ORDER BY count(ip_src) desc LIMIT 10`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getCulprit = async (req, res) => {
  const signame = req.params.signame;
  const queryText = `select INET_NTOA(iphdr.ip_src) as ip,count(iphdr.ip_src) as count from event,iphdr, signature where event.sid = iphdr.sid and event.cid = iphdr.cid and event.signature = signature.sig_id and signature.sig_name='${signame}' group by iphdr.ip_src`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getLocalSourceIpStatistic = async (req, res) => {
  const queryText =
    "select count(ip_src) as count, inet_ntoa(ip_src) as ip from iphdr where CONVERT(INET_NTOA(iphdr.ip_src),CHAR)  LIKE '%192.168%'   group by (ip_src) limit 10";
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getLocalDestinationIpStatistic = async (req, res) => {
  const queryText =
    "select count(ip_dst) as count, inet_ntoa(ip_dst) as ip from iphdr where CONVERT(INET_NTOA(iphdr.ip_dst),CHAR)  LIKE '%192.168%'   group by (ip_dst) limit 10";
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getExternalSourceIpStatistic = async (req, res) => {
  const queryText =
    "select count(ip_src) as count, inet_ntoa(ip_src) as ip from iphdr where CONVERT(INET_NTOA(iphdr.ip_src),CHAR) NOT LIKE '%192.168%' group by (ip_src) limit 10";
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getExternalDstIpStatistic = async (req, res) => {
  const queryText =
    "select count(ip_dst) as count, inet_ntoa(ip_dst) as ip from iphdr where CONVERT(INET_NTOA(iphdr.ip_dst),CHAR) NOT LIKE '%192.168%' group by (ip_dst) limit 10";
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};

ipConnect.getIpStatus = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `SELECT * FROM blocked_ip where ip = '${ip}'`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  result = data.length > 0 ? { status: 'block' } : { status: 'active' };
  res.json(result);
};
ipConnect.getNodeAlertCurDate = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `select convert(event.timestamp,char) as time, sig_name, inet_ntoa(ip_src) as ip,sig_priority from event,iphdr, signature where event.cid = iphdr.cid and event.sid = iphdr.sid  and event.signature = signature.sig_id and convert(inet_ntoa(ip_dst), char) ='${ip}' `;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  // curdate_date = data.filter((item) => {
  //   return new Date(item.time).getDate() == new Date().getDate();
  // });
  res.json(data);
};
ipConnect.getSignatureStatisticByIP = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `select distinct signame, count, sig_priority as priority
  from signature,(SELECT sig_name as signame, count(sig_name) as count
  from event,signature, iphdr
  where event.cid = iphdr.cid and event.sid = iphdr.sid
  and event.signature = signature.sig_id
  and convert(inet_ntoa(ip_dst),char) = '${ip}'
  group by sig_name) as sig_statistic
  where signature.sig_name = signame`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getCulpritByIPAndSig = async (req, res) => {
  const signame = req.params.signame;
  const ip = req.params.ip;
  const queryText = `select INET_NTOA(iphdr.ip_src) as ip,count(iphdr.ip_src) as count from event,iphdr, signature where event.sid = iphdr.sid and event.cid = iphdr.cid and event.signature = signature.sig_id 
  and signature.sig_name='${signame}' 
  and  convert(inet_ntoa(iphdr.ip_dst),char) ='${ip}' 
  group by iphdr.ip_src`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
ipConnect.getCulpritByVictimAndPriority = async (req, res) => {
  const priority = req.params.priority;
  const ip = req.params.ip;
  const queryText = `select distinct inet_ntoa(ip_src) as ip
  from event, iphdr, signature
  where event.cid = iphdr.cid and event.sid = iphdr.sid
  and event.signature = signature.sig_id
  and signature.sig_priority = '${priority}'
  and convert(inet_ntoa(ip_dst), char) = '${ip}'`;
  const data = await db.query(queryText, {
    type: QueryTypes.SELECT,
  });
  let extracted_ip = data.map((item) => item.ip);
  res.json(extracted_ip);
};
module.exports = ipConnect;
