const PDFDocument = require('pdfkit');
const { getTemplate } = require('./template.manager');

const generatePDF = (invoiceData) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margin: 30
      });
      
      const chunks = [];
      doc.on('data', chunk => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));

      // Register fonts
      doc.registerFont('Bold', 'Helvetica-Bold');
      doc.registerFont('Regular', 'Helvetica');

      // Get the requested template
      const template = getTemplate(invoiceData.template || 'classic');
      const language = invoiceData.language || 'en';

      // Create sections using the template
      template.createHeader(doc, language);
      template.createCustomerInfo(doc, invoiceData, language);
      template.createItemsTable(doc, invoiceData.items, language);
      template.createFooter(doc, invoiceData, language);

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = { generatePDF };