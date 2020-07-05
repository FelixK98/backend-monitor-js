const Sequelize = require('sequelize');

const sequelize = new Sequelize('barnyard2', 'suricata', '123456', {
  host: '192.168.10.111',
  dialect: 'mysql',
  // dialectOptions: {
  //   typeCast: function (field, next) {
  //     // for reading from database
  //     if (field.type === 'DATETIME') {
  //       return field.string();
  //     }
  //     return next();
  //   },
  // },
  // timezone: '+07:00',
});

module.exports = sequelize;
