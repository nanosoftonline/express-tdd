//customer-model.js
const { Sequelize, Model, DataTypes } = require('sequelize');
const sequelize = new Sequelize("postgres://postgres@localhost:5432/customerdb");

const Customer = sequelize.define('customer', {

    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },
    name: DataTypes.STRING,
}, { timestamps: false });

module.exports = Customer