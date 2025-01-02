const PDFDocument = require('pdfkit');
const { createHeader, createCustomerInfo, createItemsTable, createFooter } = require('./template.service');
const { formatCurrency, formatDate } = require('../utils/formatters');

const generatePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 50
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Register fonts
      doc.registerFont('Bold', 'Helvetica-Bold');
      doc.registerFont('Regular', 'Helvetica');

      // Create sections
      createHeader(doc);
      createCustomerInfo(doc, invoiceData);
      createItemsTable(doc, invoiceData.items);
      createFooter(doc, invoiceData);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };