const { formatDate } = require('../utils/formatters');
const { colors } = require('../utils/styles');
const { 
  createTableHeader,
  createTableRows,
  createTableTotal,
  TABLE_SETTINGS
} = require('./table.service');

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

  // Invoice details (left side)
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

  // Customer details (right side)
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text('BILL TO:', TABLE_SETTINGS.startX + 250, startY, { underline: true })
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(invoiceData.customerName, TABLE_SETTINGS.startX + 250)
    .text(invoiceData.customerAddress, TABLE_SETTINGS.startX + 250)
    .moveDown(2);
};

const createItemsTable = (doc, items) => {
  const tableTop = doc.y + 20;
  
  // Create table header
  const rowsStartY = createTableHeader(doc, tableTop);
  
  // Create table rows
  const { yPosition, totalAmount } = createTableRows(doc, items, rowsStartY);
  
  // Create table total
  createTableTotal(doc, yPosition, totalAmount);
};

const createFooter = (doc) => {
  const pageHeight = doc.page.height;
  
  doc
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.secondary)
    .text(
      'Thank you for your business!',
      TABLE_SETTINGS.startX,
      pageHeight - 100,
      { align: 'center', width: TABLE_SETTINGS.width }
    )
    .moveDown(0.5)
    .text(
      'Payment is due within 30 days. Please include the invoice number on your check.',
      { align: 'center', width: TABLE_SETTINGS.width }
    );
};

module.exports = {
  createHeader,
  createCustomerInfo,
  createItemsTable,
  createFooter
};