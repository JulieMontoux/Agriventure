const express = require('express');
const router = express.Router();
const companyProductController = require('../controllers/companyProductController');

router.get('/', companyProductController.getAllCompanyProducts);
router.post('/', companyProductController.createCompanyProduct);
router.get('/:id', companyProductController.getCompanyProductById);
router.put('/:id', companyProductController.updateCompanyProduct);
router.delete('/:id', companyProductController.deleteCompanyProduct);

module.exports = router;
