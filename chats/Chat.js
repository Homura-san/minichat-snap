const Sequelize = require('sequelize');
const connection = require('../database/database');
const User = require('../users/User')

const Chat = connection.define('chats', {
    content:{
        type: Sequelize.STRING,
        allowNull: false
    },date:{
        type: Sequelize.STRING,
        allowNull: false
    },name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

User.hasMany(Chat);
Chat.belongsTo(User);

//Chat.sync({force: false}).then(() => {});

module.exports = Chat;