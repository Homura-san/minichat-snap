const Sequelize = require('sequelize')
const connection = new Sequelize('chat', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
});

module.exports = connection;