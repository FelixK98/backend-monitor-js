const { QueryTypes } = require('sequelize');
const db = require('../model/db');
const alert = {};
alert.showAlertTable = async (req, res) => {
  const data = await db.query(
    "select DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as 'Time' ,  case when signature.sig_priority = 1 then 'HIGH' when signature.sig_priority = 2 then 'MEDIUM' when signature.sig_priority = 3 then 'LOW' when signature.sig_priority = 4 then 'LOW' end as Priority , case when iphdr.ip_proto = 1 then 'ICMP' when iphdr.ip_proto = 6 then 'TCP' WHEN iphdr.ip_proto = 17 then 'UDP' end as Protocol , sig_class_name as 'Class Type',  INET_NTOA(ip_src) as 'Source Address' ,  INET_NTOA(ip_dst) as 'Destination Address',  sig_name as 'Description' from event, iphdr, signature, sig_class where event.cid = iphdr.cid and event.sid = iphdr.sid and event.signature = signature.sig_id  and signature.sig_class_id = sig_class.sig_class_id ORDER BY event.timestamp desc",
    {
      type: QueryTypes.SELECT,
    }
  );
  res.json(data);
};

alert.showAlertTableBySignature = async (req, res) => {
  const sigName = req.params.sigName;
  const data = await db.query(
    `select DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as 'Time' ,  case when signature.sig_priority = 1 then 'HIGH' when signature.sig_priority = 2 then 'MEDIUM' when signature.sig_priority = 3 then 'LOW' when signature.sig_priority = 4 then 'LOW' end as Priority , case when iphdr.ip_proto = 1 then 'ICMP' when iphdr.ip_proto = 6 then 'TCP' WHEN iphdr.ip_proto = 17 then 'UDP' end as Protocol , sig_class_name as 'Class Type',  INET_NTOA(ip_src) as 'Source Address' ,  INET_NTOA(ip_dst) as 'Destination Address' from event, iphdr, signature, sig_class where event.cid = iphdr.cid and event.sid = iphdr.sid and event.signature = signature.sig_id  and signature.sig_class_id = sig_class.sig_class_id and sig_name='${sigName}' ORDER BY event.timestamp desc`,
    {
      type: QueryTypes.SELECT,
    }
  );
  res.json(data);
};

alert.test = async (req, res) => {
  const data = await db.query('select now()', {
    type: QueryTypes.SELECT,
  });
  res.json(data);
};
alert.getEventByDate = async (req, res) => {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const data = await db.query(
    `select DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:%s') as 'Time' ,  
    case when signature.sig_priority = 1 then 'HIGH' 
    when signature.sig_priority = 2 then 'MEDIUM' 
    when signature.sig_priority = 3 then 'LOW' 
    when signature.sig_priority = 4 then 'LOW' end as Priority , 
    case when iphdr.ip_proto = 1 then 'ICMP' 
    when iphdr.ip_proto = 6 then 'TCP' 
    WHEN iphdr.ip_proto = 17 then 'UDP' end as Protocol ,
    sig_class_name as 'Class Type',  
    INET_NTOA(ip_src) as 'Source Address' ,  INET_NTOA(ip_dst) as 'Destination Address', 
    sig_name as 'Description' 
    from event, iphdr, signature, sig_class 
    where event.cid = iphdr.cid and event.sid = iphdr.sid and event.signature = signature.sig_id  and signature.sig_class_id = sig_class.sig_class_id 
    and (timestamp BETWEEN DATE_ADD('${startDate}',INTERVAL 7 HOUR) AND DATE_ADD('${endDate}',INTERVAL 7 HOUR))
    ORDER BY event.timestamp desc`,
    {
      type: QueryTypes.SELECT,
    }
  );
  res.json(data);
};
const mapNetworkToSensorID = (network) => {
  switch (network) {
    case 'WAN':
      return 3;
    case 'LAN':
      return 2;
    case 'MANAGEMENT':
      return 1;
    case 'DMZ':
      return 4;
  }
};

alert.getTraffic = async (req, res) => {
  //get all date
  const dates = await db.query(
    ' select date(event.timestamp) as date from event where  (date(event.timestamp) BETWEEN DATE_SUB(date(date_add(now(), interval 7 HOUR)), INTERVAL 30 day)  AND date(date_add(now(), interval 7 HOUR))) group by date(event.timestamp)',
    {
      type: QueryTypes.SELECT,
    }
  );
  //extract param
  const network = req.params.network;
  //convert param to sensor
  const sensorID = mapNetworkToSensorID(network);
  //get event statistic
  const eventStatistic = await db.query(
    `select count(cid) as count, date(event.timestamp) as 'time' 
    from event
    where event.sid = ${sensorID}
    and  (date(event.timestamp) BETWEEN DATE_SUB(date(date_add(now(), interval 7 hour)), INTERVAL 30 day)  AND date(date_add(now(), interval 7 hour)))
    group by date(event.timestamp)`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const eventDate = eventStatistic.map((event) => event.time);

  const extractedDate = dates.map((item) => item.date);

  extractedDate.forEach((textDate) => {
    if (!eventDate.includes(textDate)) {
      eventStatistic.push({ count: 0, time: textDate });
    }
  });

  eventStatistic.sort((a, b) => {
    let dateA = new Date(a.time);
    let dateB = new Date(b.time);
    return dateA - dateB;
  });

  res.json(eventStatistic);
};
alert.getTodayTraffic = async (req, res) => {
  //get all date
  const hours = [
    0,
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    8,
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
  ];
  //extract param
  const network = req.params.network;
  //convert param to sensor
  const sensorID = mapNetworkToSensorID(network);
  //get event statistic
  let eventStatistic = await db.query(
    `select count(cid) as count, hour(event.timestamp) as 'time' 
    from event
    where event.sid = '${sensorID}'
    and  date(event.timestamp) = date(date_add(now(), interval 7 hour))
    group by hour(event.timestamp)`,
    {
      type: QueryTypes.SELECT,
    }
  );
  const eventHours = eventStatistic.map((event) => event.time);

  hours.forEach((hour) => {
    if (!eventHours.includes(hour)) {
      eventStatistic.push({ count: 0, time: hour });
    }
  });

  eventStatistic.sort((a, b) => {
    let hourA = a.time;
    let hourB = b.time;
    return hourA - hourB;
  });
  eventStatistic = eventStatistic.map((item) => {
    return { ...item, time: `${item.time} H` };
  });

  res.json(eventStatistic);
};
//
alert.getPriorities = async (req, res) => {
  let data = await db.query(
    'select count(signature.sig_priority) as count , signature.sig_priority as priority from event, signature where event.signature = signature.sig_id  group by signature.sig_priority order by signature.sig_priority asc',
    {
      type: QueryTypes.SELECT,
    }
  );

  res.json(data);
};

alert.getPriorityDetail = async (req, res) => {
  const priority = req.params.id;
  const query = `select sig_name as signame, count(sig_name) as count from event, signature where event.signature = signature.sig_id and signature.sig_priority = ${priority} group by signature.sig_name`;
  let data = await db.query(query, {
    type: QueryTypes.SELECT,
  });

  res.json(data);
};
alert.getEventByIPAndSignature = async (req, res) => {
  const ip = req.params.ip;
  const sigName = req.params.sig;
  const query = `select convert(event.timestamp, char) as time, sensor.hostname as sensor
  from event,iphdr, signature, sensor
  where event.cid = iphdr.cid and event.sid = iphdr.sid
  and event.signature = signature.sig_id
  and event.sid = sensor.sid
  and convert(inet_ntoa(iphdr.ip_src),char) = '${ip}'
  and signature.sig_name= '${sigName}'`;

  let data = await db.query(query, {
    type: QueryTypes.SELECT,
  });

  res.json(data);
};

module.exports = alert;
