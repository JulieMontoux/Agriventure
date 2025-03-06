const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PaymentType = sequelize.define('PaymentType', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  type: { type: DataTypes.STRING, allowNull: false },
}, {
  timestamps: true,
});

module.exports = PaymentType;
