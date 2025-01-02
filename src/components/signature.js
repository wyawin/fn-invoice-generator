const { colors } = require('../utils/styles');
const { translations } = require('../utils/translations');
const { formatDate } = require('../utils/formatters');
const { addSignatureImages } = require('./signature-images');

const createSignatureBox = (doc, withSignature, yPosition, language = 'en') => {
  const t = translations[language].signature;
  const startX = 50;
  const boxWidth = 200;
  const boxHeight = 175;
  const margin = 10;

  // Draw signature box
  doc
    .fillColor('#ffffff')
    .rect(startX, yPosition, boxWidth, boxHeight)
    .fill()
    .strokeColor(colors.primary)
    .lineWidth(1)
    .stroke();

  // Add title
  doc
    .font('Bold')
    .fontSize(10)
    .fillColor(colors.primary)
    .text(t.title, startX + margin, yPosition + margin);



  // Add stamp and signature images
  if(withSignature) {
    addSignatureImages(doc, startX, yPosition);
  }
  

  // Add signature line
  doc
    .moveTo(startX + margin, yPosition + 130)
    .lineTo(startX + boxWidth - margin - 10, yPosition + 130)
    .strokeColor(colors.secondary)
    .stroke();

  // Add name and position
  doc
    .font('Regular')
    .fontSize(10)
    .fillColor(colors.text)
    .text(t.name, startX + margin, yPosition + 140)
    .text(t.position, startX + margin, yPosition + 155);

  return yPosition + boxHeight;
};

module.exports = { createSignatureBox };