const { generatePDF } = require('../services/pdf.service');
const { v4: uuidv4 } = require('uuid');

const generateInvoice = async (req, res) => {
  try {
    let invoiceData = {
      id: uuidv4(),
      ...req.body,
      invoiceDate: new Date(req.body.invoiceDate).toISOString(),
      createdAt: new Date().toISOString()
    };

    const dueDate = new Date(new Date().setDate((new Date(invoiceData.invoiceDate)).getDate() + invoiceData.dueIn));

    invoiceData = {
      ...invoiceData,
      dueDate: dueDate.toISOString()
    }

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