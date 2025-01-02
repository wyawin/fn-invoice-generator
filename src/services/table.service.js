const { colors } = require('../utils/styles');
const { formatCurrency } = require('../utils/formatters');
const { translations } = require('../utils/translations');

const TABLE_SETTINGS = {
  startX: 50,
  width: 495,
  columnWidths: [245, 70, 90, 90],
  rowHeight: 20,
  headerHeight: 20,
  margin: {
    right: 50  // Add right margin to ensure content stays within bounds
  }
};

const createTableHeader = (doc, yPosition, language = 'en') => {
  const t = translations[language];
  const headers = [t.description, t.quantity, t.unitPrice, t.amount];
  
  // Header background
  doc
    .fillColor(colors.primary)
    .rect(TABLE_SETTINGS.startX, yPosition - 10, TABLE_SETTINGS.width, TABLE_SETTINGS.headerHeight)
    .fill();

  // Header text
  doc
    .font('Bold')
    .fontSize(10)
    .fillColor('#FFFFFF');

  let xOffset = TABLE_SETTINGS.startX;
  headers.forEach((header, i) => {
    doc.text(
      header,
      xOffset,
      yPosition - 5,
      {
        width: TABLE_SETTINGS.columnWidths[i],
        align: i === 0 ? 'left' : 'right'
      }
    );
    xOffset += TABLE_SETTINGS.columnWidths[i];
  });

  return yPosition + TABLE_SETTINGS.headerHeight;
};

const createTableRows = (doc, items, startY) => {
  let yPosition = startY;
  let totalAmount = 0;

  items.forEach((item, index) => {
    const amount = item.quantity * item.price;
    totalAmount += amount;

    // Alternate row background
    if (index % 2 === 0) {
      doc
        .fillColor(colors.tableRow)
        .rect(TABLE_SETTINGS.startX, yPosition - 5, TABLE_SETTINGS.width, TABLE_SETTINGS.rowHeight)
        .fill();
    }

    doc
      .font('Regular')
      .fontSize(10)
      .fillColor(colors.text);

    let xOffset = TABLE_SETTINGS.startX;
    
    // Description
    doc.text(
      item.description,
      xOffset,
      yPosition,
      { width: TABLE_SETTINGS.columnWidths[0] }
    );
    xOffset += TABLE_SETTINGS.columnWidths[0];

    // Quantity
    doc.text(
      item.quantity.toString(),
      xOffset,
      yPosition,
      { width: TABLE_SETTINGS.columnWidths[1], align: 'right' }
    );
    xOffset += TABLE_SETTINGS.columnWidths[1];

    // Unit Price
    doc.text(
      formatCurrency(item.price),
      xOffset,
      yPosition,
      { width: TABLE_SETTINGS.columnWidths[2], align: 'right' }
    );
    xOffset += TABLE_SETTINGS.columnWidths[2];

    // Amount
    doc.text(
      formatCurrency(amount),
      xOffset,
      yPosition,
      { width: TABLE_SETTINGS.columnWidths[3], align: 'right' }
    );

    yPosition += TABLE_SETTINGS.rowHeight;
  });

  return { yPosition, totalAmount };
};

const createTableTotal = (doc, yPosition, totalAmount) => {
  const totalWidth = 180;
  const startX = TABLE_SETTINGS.startX + TABLE_SETTINGS.width - totalWidth;
  
  // Add total box with background
  doc
    .fillColor('#f8fafc')
    .rect(startX, yPosition + 5, totalWidth, 30)
    .fill()
    .strokeColor(colors.primary)
    .lineWidth(1)
    .stroke();

  // Add total text and amount
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(
      'Total:',
      startX + 10,
      yPosition + 15
    )
    .text(
      formatCurrency(totalAmount),
      startX,
      yPosition + 15,
      { 
        width: totalWidth - 20,
        align: 'right' 
      }
    );
};

const createItemsTable = (doc, items, language = 'en') => {
  const tableTop = doc.y + 20;
  
  // Create table header
  const rowsStartY = createTableHeader(doc, tableTop, language);
  
  // Create table rows
  const { yPosition, totalAmount } = createTableRows(doc, items, rowsStartY);
  
  // Create table total
  createTableTotal(doc, yPosition, totalAmount, language);
};

module.exports = {
  createItemsTable,
  TABLE_SETTINGS
};