const express = require('express');
const router = express.Router();
const invoiceController = require('../controllers/invoice.controller');
const validateInvoice = require('../middleware/validateInvoice');
const validateApiKey = require('../middleware/apiKeyAuth');

// Apply API key validation to all routes
router.use(validateApiKey);

router.post('/generate', validateInvoice, invoiceController.generateInvoice);

module.exports = router;