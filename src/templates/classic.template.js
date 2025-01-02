const { colors } = require('../utils/styles');
const { formatDate } = require('../utils/formatters');
const { createItemsTable } = require('../services/table.service');

const createHeader = (doc) => {
  doc
    .font('Bold')
    .fontSize(24)
    .fillColor(colors.primary)
    .text('INVOICE', { align: 'right' })
    .moveDown(0.5);

  doc
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.secondary)
    .text('Your Company Name', { align: 'right' })
    .text('123 Business Street', { align: 'right' })
    .text('contact@yourcompany.com', { align: 'right' })
    .moveDown(2);
};

const createCustomerInfo = (doc, invoiceData) => {
  const startY = doc.y;

  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text('INVOICE DETAILS', { underline: true })
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(`Invoice Number: #${invoiceData.id.slice(0, 8).toUpperCase()}`)
    .text(`Date: ${formatDate(invoiceData.createdAt)}`)
    .moveDown(0.5);

  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text('BILL TO:', 300, startY, { underline: true })
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(invoiceData.customerName, 300)
    .text(invoiceData.customerAddress, 300)
    .moveDown(2);
};

const createFooter = (doc) => {
  const pageHeight = doc.page.height;
  
  doc
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.secondary)
    .text(
      'Thank you for your business!',
      50,
      pageHeight - 100,
      { align: 'center' }
    )
    .moveDown(0.5)
    .text(
      'Payment is due within 30 days. Please include the invoice number on your check.',
      { align: 'center' }
    );
};

module.exports = {
  name: 'classic',
  createHeader,
  createCustomerInfo,
  createItemsTable,
  createFooter
};