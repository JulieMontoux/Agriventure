const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Product = sequelize.define('Product', {
  category_id: DataTypes.INTEGER,
  variety: DataTypes.STRING,
  description: DataTypes.TEXT
}, {
  timestamps: true
});

module.exports = Product;
