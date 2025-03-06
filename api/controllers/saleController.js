const Sale = require('../models/sale');
const CompanyProduct = require('../models/companyProduct');
const Seller = require('../models/seller');
const PaymentType = require('../models/paymentType');

exports.getAllSales = async (req, res) => {
  try {
    const sales = await Sale.findAll({
      include: [CompanyProduct, Seller, PaymentType]
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch sales' });
  }
};

exports.createSale = async (req, res) => {
  try {
    const sale = await Sale.create(req.body);
    res.status(201).json(sale);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create sale' });
  }
};

exports.getSaleById = async (req, res) => {
  try {
    const sale = await Sale.findByPk(req.params.id, {
      include: [CompanyProduct, Seller, PaymentType]
    });
    if (sale) {
      res.json(sale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch sale' });
  }
};

exports.updateSale = async (req, res) => {
  try {
    const [updated] = await Sale.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSale = await Sale.findByPk(req.params.id, {
        include: [CompanyProduct, Seller, PaymentType]
      });
      res.json(updatedSale);
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to update sale' });
  }
};

exports.deleteSale = async (req, res) => {
  try {
    const deleted = await Sale.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Sale not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete sale' });
  }
};
