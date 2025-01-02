const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const validateInvoice = require('../middleware/validateInvoice');

router.post('/generate', validateInvoice, invoiceController.generateInvoice);

module.exports = router;