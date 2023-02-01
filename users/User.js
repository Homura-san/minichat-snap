const Sequelize = require('sequelize');
const connection = require('../database/database');


const User = connection.define('users', {
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },password:{
        type: Sequelize.STRING,
        allowNull: false
    },name:{
        type: Sequelize.STRING,
        allowNull: false
    }
})

//User.hasMany(Chat);
//Chat.belongsTo(User);

User.sync({force: false}).then(() => {});

module.exports = User;