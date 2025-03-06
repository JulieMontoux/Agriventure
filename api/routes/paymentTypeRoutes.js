const express = require('express');
const router = express.Router();
const paymentTypeController = require('../controllers/paymentTypeController');

router.get('/', paymentTypeController.getAllPaymentTypes);
router.post('/', paymentTypeController.createPaymentType);
router.get('/:id', paymentTypeController.getPaymentTypeById);
router.put('/:id', paymentTypeController.updatePaymentType);
router.delete('/:id', paymentTypeController.deletePaymentType);

module.exports = router;
