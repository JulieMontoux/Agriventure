const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const Company = require('./company');
const Product = require('./product');

const CompanyProduct = sequelize.define('CompanyProduct', {
  weight: DataTypes.INTEGER,
  stock: DataTypes.INTEGER
}, {
  timestamps: true
});

CompanyProduct.belongsTo(Company, { foreignKey: 'company_id' });
CompanyProduct.belongsTo(Product, { foreignKey: 'product_id' });

module.exports = CompanyProduct;