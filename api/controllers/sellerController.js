const Seller = require('../models/seller');

exports.getAllSellers = async (req, res) => {
  try {
    const sellers = await Seller.findAll();
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch sellers' });
  }
};

exports.createSeller = async (req, res) => {
  try {
    const seller = await Seller.create(req.body);
    res.status(201).json(seller);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create seller' });
  }
};

exports.getSellerById = async (req, res) => {
  try {
    const seller = await Seller.findByPk(req.params.id);
    if (seller) {
      res.json(seller);
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch seller' });
  }
};

exports.updateSeller = async (req, res) => {
  try {
    const [updated] = await Seller.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedSeller = await Seller.findByPk(req.params.id);
      res.json(updatedSeller);
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to update seller' });
  }
};

exports.deleteSeller = async (req, res) => {
  try {
    const deleted = await Seller.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Seller not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete seller' });
  }
};
