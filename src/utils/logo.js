const { colors } = require('./styles');

const drawPlaceholderLogo = (doc, x, y, size = 40) => {
  // Save graphics state
  doc.save();
  
  // Draw circle background
  doc
    .circle(x + size/2, y + size/2, size/2)
    .fillColor('#FFFFFF')
    .fill();

  // Draw stylized "C" for company
  doc
    .moveTo(x + size * 0.65, y + size * 0.25)
    .bezierCurveTo(
      x + size * 0.3, y + size * 0.25,
      x + size * 0.2, y + size * 0.4,
      x + size * 0.2, y + size * 0.5
    )
    .bezierCurveTo(
      x + size * 0.2, y + size * 0.6,
      x + size * 0.3, y + size * 0.75,
      x + size * 0.65, y + size * 0.75
    )
    .strokeColor('#FFFFFF')
    .lineWidth(3)
    .stroke();

  // Restore graphics state
  doc.restore();
};

module.exports = {
  drawPlaceholderLogo
};