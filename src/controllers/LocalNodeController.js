const { QueryTypes } = require('sequelize');
const mysql = require('../model/db');
const axios = require('axios');
const localNode = {};
localNode.getAllNodes = async (req, res) => {
  const data = await mysql.query('select *  from local_nodes', {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};

localNode.getNodeByNetWork = async (req, res) => {
  const network = req.params.network;
  const queryText = `select *  from local_nodes where network = "${network}"`;
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
localNode.getNodeEvents = async (req, res) => {
  const name = req.params.name;
  const queryText = `select DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as 'Time' ,  
  case when convert(inet_ntoa(ip_src),char) = local_nodes.ip then local_nodes.name    
  ELSE convert(inet_ntoa(ip_src),char) 
  end as 'Src Address' , 
  case when convert(inet_ntoa(ip_dst),char) = local_nodes.ip then local_nodes.name    
  ELSE convert(inet_ntoa(ip_dst),char) 
  end as 'Dst Address',	  
  sig_name as 'Description'     
  from event, iphdr, signature, local_nodes
  where event.cid = iphdr.cid and event.sid = iphdr.sid and event.signature = signature.sig_id
  and (convert(inet_ntoa(ip_dst),char) = local_nodes.ip or convert(inet_ntoa(ip_src),char) = local_nodes.ip)
  and local_nodes.name = '${name}'
  ORDER BY event.timestamp desc`;
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
localNode.getNodeByIP = async (req, res) => {
  const ip = req.params.ip;
  const queryText = `select *  from local_nodes where ip = "${ip}"`;
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
localNode.getLocalSourceIpStatistic = async (req, res) => {
  const queryText =
    'select count(local_nodes.ip) as count, local_nodes.ip from iphdr, local_nodes where CONVERT(INET_NTOA(iphdr.ip_src),CHAR)  = local_nodes.ip OR CONVERT(INET_NTOA(iphdr.ip_dst),CHAR)  = local_nodes.ip group by (local_nodes.ip) ';
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
localNode.getExternalSourceIpStatistic = async (req, res) => {
  const queryText =
    "select count(ip_src) as count, inet_ntoa(ip_src) as ip from iphdr where CONVERT(INET_NTOA(iphdr.ip_src),CHAR) NOT LIKE '%192.168%' group by (ip_src)";
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
localNode.getNodeCount = async (req, res) => {
  const interface = req.params.interface;
  const queryText = `select local_nodes.name , count(local_nodes.name) as count
    from event, local_nodes,iphdr
    where event.sid = iphdr.sid and event.cid = iphdr.cid
    and (convert(inet_ntoa(ip_dst),char) = local_nodes.ip or convert(inet_ntoa(ip_src),char) = local_nodes.ip)
    and local_nodes.network = '${interface}'
    GROUP BY local_nodes.name
    order by count desc`;
  const data = await mysql.query(queryText, {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};

getNetwork = (ip) => {
  let network = 'LAN';
  if (ip.includes('192.168.30.')) network = 'MANAGEMENT';
  else if (ip.includes('192.168.40')) nerwork = 'DMZ';
  return network;
};

localNode.addNode = async (req, res) => {
  const ip = req.query.ip;
  const name = req.query.name;
  const type = req.query.type;
  let result = {};
  ping = await axios.get(`http://192.168.10.10:7000/getMAC/${ip}`);

  if (ping.data == 'Host doesnt exist') {
    result = {
      isValid: 'invalid',
      err: ping.data,
    };
  } else {
    const mac = ping.data;
    const network = getNetwork(ip);
    const queryText = `INSERT INTO local_nodes (ip, name, type, mac, network) VALUES ('${ip}','${name}', '${type}', '${mac}', '${network}')`;
    const data = await mysql.query(queryText, {
      type: QueryTypes.INSERT,
    });
    result = {
      isValid: 'valid',
    };
  }

  res.json(result);
};

module.exports = localNode;
