const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize(process.env.PGURI);

const User = sequelize.define('user', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING
}, { timestamps: false });

module.exports = User
