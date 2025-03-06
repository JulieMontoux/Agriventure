const PaymentType = require('../models/paymentType');

exports.getAllPaymentTypes = async (req, res) => {
  try {
    const paymentTypes = await PaymentType.findAll();
    res.json(paymentTypes);
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch payment types' });
  }
};

exports.createPaymentType = async (req, res) => {
  try {
    const paymentType = await PaymentType.create(req.body);
    res.status(201).json(paymentType);
  } catch (error) {
    res.status(400).json({ error: 'Unable to create payment type' });
  }
};

exports.getPaymentTypeById = async (req, res) => {
  try {
    const paymentType = await PaymentType.findByPk(req.params.id);
    if (paymentType) {
      res.json(paymentType);
    } else {
      res.status(404).json({ error: 'PaymentType not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to fetch payment type' });
  }
};

exports.updatePaymentType = async (req, res) => {
  try {
    const [updated] = await PaymentType.update(req.body, {
      where: { id: req.params.id }
    });
    if (updated) {
      const updatedPaymentType = await PaymentType.findByPk(req.params.id);
      res.json(updatedPaymentType);
    } else {
      res.status(404).json({ error: 'PaymentType not found' });
    }
  } catch (error) {
    res.status(400).json({ error: 'Unable to update payment type' });
  }
};

exports.deletePaymentType = async (req, res) => {
  try {
    const deleted = await PaymentType.destroy({
      where: { id: req.params.id }
    });
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'PaymentType not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Unable to delete payment type' });
  }
};
