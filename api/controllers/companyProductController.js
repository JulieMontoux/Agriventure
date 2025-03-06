const CompanyProduct = require('../models/companyProduct');
const Company = require('../models/company');
const Product = require('../models/product');

exports.getAllCompanyProducts = async (req, res) => {
  try {
    const companyProducts = await CompanyProduct.findAll({
      include: [Company, Product]
    });
    res.json(companyProducts);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch company products' });
  }
};

exports.createCompanyProduct = async (req, res) => {
  try {
    const companyProduct = await CompanyProduct.create(req.body);
    res.status(201).json(companyProduct);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create company product' });
  }
};

exports.getCompanyProductById = async (req, res) => {
  try {
    const companyProduct = await CompanyProduct.findByPk(req.params.id, {
      include: [Company, Product]
    });
    if (companyProduct) {
      res.json(companyProduct);
    } else {
      res.status(404).json({ error: 'CompanyProduct not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch company product' });
  }
};

exports.updateCompanyProduct = async (req, res) => {
  try {
    const [updated] = await CompanyProduct.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedCompanyProduct = await CompanyProduct.findByPk(req.params.id, {
        include: [Company, Product]
      });
      res.json(updatedCompanyProduct);
    } else {
      res.status(404).json({ error: 'CompanyProduct not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to update company product' });
  }
};

exports.deleteCompanyProduct = async (req, res) => {
  try {
    const deleted = await CompanyProduct.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'CompanyProduct not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete company product' });
  }
};
