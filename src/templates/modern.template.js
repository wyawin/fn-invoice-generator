const { colors } = require('../utils/styles');
const { formatDate } = require('../utils/formatters');
const { createItemsTable } = require('../services/table.service');
const path = require('path');
const { translations } = require('../utils/translations');

const LOGO_URL = path.join(__dirname, '../images/logo1.png');
const LOGO_SIZE = 40;

const createHeader = (doc, language = 'en') => {
  const t = translations[language];
  // Modern header with a colored banner
  doc
    .fillColor(colors.secondary)
    .rect(0, 0, doc.page.width, 80)
    .fill();

  // Add logo image
  doc.image(LOGO_URL, 50, 20, {
    // width: LOGO_SIZE,
    height: LOGO_SIZE
  });


  doc
    .font('Bold')
    .fontSize(28)
    .fillColor('#FFFFFF')
    .text(t.invoice, 100, 30)
    .fontSize(10)
    .font('Regular')
    .text('PT Finskor Teknologi Indonesia', doc.page.width - 260, 20)
    .text('Gedung AD Premier Lt 9, Jl. TB Simatupang No.5, RT.5/RW.7, Ps. Minggu, Jakarta Selatan', doc.page.width - 260, 35)
    .text('support@fineksi.com', doc.page.width - 260, 60);

  doc.moveDown(4);
};

const createCustomerInfo = (doc, invoiceData, language = 'en') => {
  const t = translations[language];
  const startY = doc.y;

  // Invoice details with modern box design
  doc
    .rect(50, startY, 200, 100)
    .fillAndStroke('#f8fafc', colors.primary);

  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(t.invoiceDetails, 60, startY + 10)
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(`${t.invoiceNumber}: #${invoiceData.invoiceNumber}`, 60, startY + 30)
    .text(`${t.date}: ${formatDate(invoiceData.invoiceDate, language)}`, 60, startY + 50)
    .text(`${t.dueDate}: ${formatDate(invoiceData.dueDate, language)}`, 60, startY + 70);

  // Customer details with modern box design
  doc
    .rect(300, startY, 250, 100)
    .fillAndStroke('#f8fafc', colors.primary);

  doc
    .font('Bold')
    .fontSize(12)
    .fillColor(colors.primary)
    .text(t.billTo, 310, startY + 10)
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(invoiceData.customerName, 310, startY + 30)
    .text(invoiceData.customerRecipient, 310, startY + 50)
    .text(invoiceData.customerAddress, 310, startY + 70);

  doc.moveDown(3);
};

const createFooter = (doc, invoiceData, language = 'en') => {
  const t = translations[language];
  const pageHeight = doc.page.height;
  
  // Modern footer with background
  doc
    .rect(0, pageHeight - 80, doc.page.width, 80)
    .fill('#f8fafc');

  doc
    .font('Bold')
    .fontSize(10)
    .fillColor(colors.primary)
    .text(
      t.thankYou,
      0,
      pageHeight - 60,
      { align: 'center' }
    )
    .font('Regular')
    .fontSize(9)
    .fillColor(colors.secondary)
    .text(
      `${t.paymentTerms} ${invoiceData.dueIn} ${t.paymentTermsNext}`,
      { align: 'center' }
    );
};

module.exports = {
  name: 'modern',
  createHeader,
  createCustomerInfo,
  createItemsTable,
  createFooter
};