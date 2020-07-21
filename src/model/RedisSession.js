const asyncRedis = require('async-redis');

const client = asyncRedis.createClient({
  host: '192.168.10.111',
  port: 6379,
});

module.exports = client;
