const { formatCurrency, formatDate } = require('../utils/formatters');
const { colors, fonts } = require('../utils/styles');

const createHeader = (doc) => {
  doc
    .font('Bold')
    .fontSize(24)
    .fillColor(colors.primary)
    .text('INVOICE', { align: 'right' })
    .moveDown(0.5);

  // Add company info
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
    .text('BILL TO:', 300, startY, { underline: true })
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(invoiceData.customerName, 300)
    .text(invoiceData.customerAddress, 300)
    .moveDown(2);
};

const createItemsTable = (doc, items) => {
  // Table headers
  const tableTop = doc.y + 20;
  const tableHeaders = ['Description', 'Quantity', 'Unit Price', 'Amount'];
  const columnWidths = [280, 70, 100, 100];
  let xOffset = 50;

  // Draw header background
  doc
    .fillColor(colors.primary)
    .rect(50, tableTop - 10, 500, 20)
    .fill();

  // Draw headers
  doc
    .font('Bold')
    .fontSize(10)
    .fillColor('#FFFFFF');

  tableHeaders.forEach((header, i) => {
    doc.text(header, xOffset, tableTop - 5, {
      width: columnWidths[i],
      align: i === 0 ? 'left' : 'right'
    });
    xOffset += columnWidths[i];
  });

  // Draw items
  let yPosition = tableTop + 20;
  let totalAmount = 0;

  items.forEach((item, index) => {
    const amount = item.quantity * item.price;
    totalAmount += amount;
    xOffset = 50;

    // Alternate row background
    if (index % 2 === 0) {
      doc
        .fillColor(colors.tableRow)
        .rect(50, yPosition - 5, 500, 20)
        .fill();
    }

    doc
      .font('Regular')
      .fontSize(10)
      .fillColor(colors.text);

    // Item details
    doc.text(item.description, xOffset, yPosition, { width: columnWidths[0] });
    doc.text(item.quantity.toString(), xOffset + columnWidths[0], yPosition, { width: columnWidths[1], align: 'right' });
    doc.text(formatCurrency(item.price), xOffset + columnWidths[0] + columnWidths[1], yPosition, { width: columnWidths[2], align: 'right' });
    doc.text(formatCurrency(amount), xOffset + columnWidths[0] + columnWidths[1] + columnWidths[2], yPosition, { width: columnWidths[3], align: 'right' });

    yPosition += 20;
  });

  // Draw total
  const totalY = yPosition + 20;
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text('Total:', 350, totalY)
    .text(formatCurrency(totalAmount), 450, totalY, { align: 'right' });
};

const createFooter = (doc, invoiceData) => {
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
  createHeader,
  createCustomerInfo,
  createItemsTable,
  createFooter
};