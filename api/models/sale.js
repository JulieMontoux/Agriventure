const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const CompanyProduct = require('./companyProduct');
const Seller = require('./seller');
const PaymentType = require('./paymentType');

const Sale = sequelize.define('Sale', {
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false
  }
}, {
  timestamps: true
});

Sale.belongsTo(CompanyProduct, { foreignKey: 'company_product_id' });
Sale.belongsTo(Seller, { foreignKey: 'seller_id' });
Sale.belongsTo(PaymentType, { foreignKey: 'payment_type_id' });

module.exports = Sale;
