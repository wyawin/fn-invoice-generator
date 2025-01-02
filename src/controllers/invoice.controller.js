const { generatePDF } = require('../services/pdf.service');
const { v4: uuidv4 } = require('uuid');

const generateInvoice = async (req, res) => {
  try {
    const invoiceData = {
      id: uuidv4(),
      ...req.body,
      createdAt: new Date().toISOString()
    };

    const pdfBuffer = await generatePDF(invoiceData);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=invoice-${invoiceData.id}.pdf`);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error generating invoice:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to generate invoice' 
    });
  }
};

module.exports = {
  generateInvoice
};