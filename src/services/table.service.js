const { colors } = require('../utils/styles');
const { formatCurrency } = require('../utils/formatters');
const { translations } = require('../utils/translations');
const bankDetails = require('../config/bankDetails');
const { createSignatureBox } = require('../components/signature');

const TABLE_SETTINGS = {
  startX: 50,
  width: 495,
  columnWidths: [240, 70, 90, 90],
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
      i === 0 ? xOffset + 5 : xOffset ,
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
    const amount = Math.round(item.quantity * item.price, 0);
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
      xOffset + 5,
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

const generateTotalGrossUpInAdvance = (doc, yPosition, totalAmount, language = 'en', totalWidth, startX, percentageGrossUp) => {
  const t = translations[language];
  const divider = 100 - percentageGrossUp;
  const amountGrossUp = Math.round((totalAmount / divider) * 100);
  const taxAmount = amountGrossUp - totalAmount;
  // Add total text and amount
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(
      `${t.total}`,
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

    // Add total text and amount
    doc
    .font('Regular')
    .fontSize(11)
    .fillColor(colors.text)
    .text(
      `${t.totalGrossUp}`,
      startX + 10,
      yPosition + 35
    )
    .text(
      formatCurrency(amountGrossUp),
      startX,
      yPosition + 35,
      { 
        width: totalWidth - 20,
        align: 'right' 
      }
    );

    // Add total text and amount
    doc
    .font('Regular')
    .fontSize(11)
    .fillColor(colors.text)
    .text(
      `${t.tax}`,
      startX + 10,
      yPosition + 55
    )
    .text(
      formatCurrency(taxAmount),
      startX,
      yPosition + 55,
      { 
        width: totalWidth - 20,
        align: 'right' 
      }
    );

    return { amountGrossUp, taxAmount };
}

const generateTotalGrossUpInArrear = (doc, yPosition, totalAmount, language = 'en', totalWidth, startX, percentageGrossUp, taxRounding) => {
  const t = translations[language];  
  let taxAmount = 0;
  if(taxRounding === "normalRound") {
    taxAmount = Math.round((totalAmount * percentageGrossUp)/100);
  } else {
    taxAmount = Math.floor((totalAmount * percentageGrossUp)/100);
  }
  const amountNet = totalAmount - taxAmount;
  // Add total text and amount
  doc
    .font('Regular')
    .fontSize(11)
    .fillColor(colors.text)
    .text(
      `${t.totalGrossUp}`,
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

    // Add total text and amount
    doc
    .font('Regular')
    .fontSize(11)
    .fillColor(colors.text)
    .text(
      `${t.tax}`,
      startX + 10,
      yPosition + 35
    )
    .text(
      formatCurrency(taxAmount),
      startX,
      yPosition + 35,
      { 
        width: totalWidth - 20,
        align: 'right' 
      }
    );

    // Add total text and amount
    doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(
      `${t.total}`,
      startX + 10,
      yPosition + 55
    )
    .text(
      formatCurrency(amountNet),
      startX,
      yPosition + 55,
      { 
        width: totalWidth - 20,
        align: 'right' 
      }
    );

    return { amountNet, taxAmount };
}

// const createTransferDetails = (doc, withSignature, yPosition, language = 'en') => {
//   const t = translations[language];
//   const startX = TABLE_SETTINGS.startX;
//   const totalWidth = TABLE_SETTINGS.width;
//   const columnWidth = totalWidth / 2 - 10; // Split into two columns with padding

//   // Add transfer details box with background
//   doc
//     .fillColor('#f8fafc')
//     .rect(startX, yPosition + 90, totalWidth, 80)
//     .fill()
//     .strokeColor(colors.primary)
//     .lineWidth(1)
//     .stroke();

//   // Add transfer details header
//   doc
//     .font('Bold')
//     .fontSize(12)
//     .fillColor(colors.primary)
//     .text(t.transferDetails, startX + 10, yPosition + 100);

//   // Left column - Bank details
//   doc
//     .font('Regular')
//     .fontSize(10)
//     .fillColor(colors.text)
//     .text(`${t.bankName}: ${bankDetails.bankName}`, startX + 10, yPosition + 120)
//     .text(`${t.accountNumber}: ${bankDetails.accountNumber}`, startX + 10, yPosition + 135)
//     .text(`${t.accountName}: ${bankDetails.accountName}`, startX + 10, yPosition + 150);

//   // Right column - Tax and Billing codes
//   const rightColumnX = startX + columnWidth + 20;
//   doc
//     .text(`${t.taxCode}: ${bankDetails.taxCode}`, rightColumnX, yPosition + 120)
//     .text(`${t.billingCode}: ${bankDetails.billingCode}`, rightColumnX, yPosition + 135);

//   // Add signature box below
//   createSignatureBox(doc, withSignature, yPosition + 190, language);
// };

const COLUMN_WIDTHS = {
  left: {
    label: 90,    // Width for labels
    separator: 15,  // Width for colon
    value: 150     // Width for values
  },
  right: {
    label: 90,    // Width for labels
    separator: 15,  // Width for colon
    value: 130     // Width for values
  }
};


const createDetailRow = (doc, text, value, x, y, position) => {
  columnConfig = COLUMN_WIDTHS[position];
  doc
    .text(text, x, y, { width: columnConfig.label, align: 'left' })
    .text(':', x + columnConfig.label, y, { width: columnConfig.separator, align: 'center' })
    .text(value, x + columnConfig.label + columnConfig.separator, y, { width: columnConfig.value, align: 'left' });
};

const createTransferDetails = (doc, withSignature, withTaxCode, yPosition, language = 'en') => {
  const t = translations[language];
  const startX = TABLE_SETTINGS.startX;;
  const boxWidth = TABLE_SETTINGS.width;
  const boxHeight = 90;
  const margin = 10;

  // Background box
  doc
    .fillColor('#f8fafc')
    .rect(startX, yPosition + 85, boxWidth, boxHeight)
    .fill()
    .strokeColor(colors.primary)
    .lineWidth(1)
    .stroke();

  // Header
  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(t.transferDetails, startX + margin, yPosition + 100);

  // Set font for details
  doc
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text);

  // Left column
  const leftX = startX + margin;
  createDetailRow(doc, t.bankName, bankDetails.bankName, leftX, yPosition + 120, 'left');
  createDetailRow(doc, t.accountNumber, bankDetails.accountNumber, leftX, yPosition + 135, 'left');
  createDetailRow(doc, t.accountName, bankDetails.accountName, leftX, yPosition + 150, 'left');

  // Right column
  if(withTaxCode){
    const rightX = startX + ((boxWidth/3) *2) - 10;
    createDetailRow(doc, t.taxCode, bankDetails.taxCode, rightX, yPosition + 120, 'right');
    createDetailRow(doc, t.billingCode, bankDetails.billingCode, rightX, yPosition + 135, 'right');
  }
  

  createSignatureBox(doc, withSignature, yPosition + 190, language);
  return yPosition + boxHeight;
};

const createTableTotal = (doc, yPosition, totalAmount, invoiceData, language = 'en') => {
  const t = translations[language];
  const totalWidth = 220;
  const startX = TABLE_SETTINGS.startX + TABLE_SETTINGS.width - totalWidth;

  const grossUpInAdvance = invoiceData.grossUpInAdvance;
  const percentageGrossUp = invoiceData.percentageGrossUp;
  const taxRounding = invoiceData.taxRounding;
  
  // Add total box with background
  doc
    .fillColor('#f8fafc')
    .rect(startX, yPosition + 5, totalWidth, 70)
    .fill()
    .strokeColor(colors.primary)
    .lineWidth(1)
    .stroke();

  let result;
  if(grossUpInAdvance){
    result = generateTotalGrossUpInAdvance(doc, yPosition, totalAmount, language, totalWidth, startX, percentageGrossUp);
  } else {
    result = generateTotalGrossUpInArrear(doc, yPosition, totalAmount, language, totalWidth, startX, percentageGrossUp, taxRounding);
  }

  // Add transfer details
  createTransferDetails(doc, invoiceData.withSignature, invoiceData.withTaxCode, yPosition, language);
  
  return result;
};

const createItemsTable = (doc, items, invoiceData, language = 'en') => {
  const tableTop = doc.y + 20;
  
  // Create table header
  const rowsStartY = createTableHeader(doc, tableTop, language);
  
  // Create table rows
  const { yPosition, totalAmount } = createTableRows(doc, items, rowsStartY);
  
  // Create table total and transfer details
  const result = createTableTotal(doc, yPosition, totalAmount, invoiceData, language);
  
  // Move the cursor below both the total and transfer details sections
  doc.y = yPosition + 190;
  
  return result;
};

module.exports = {
  createItemsTable,
  TABLE_SETTINGS
};