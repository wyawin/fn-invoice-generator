const path = require('path');

const SIGNATURE_CONFIG = {
  stamp: {
    path: path.join(__dirname, '../images/stamp.png'),
    // width: 80,
    height: 30
  },
  signature: {
    path: path.join(__dirname, '../images/sig.png'),
    // width: 120,
    height: 70
  }
};

const addSignatureImages = (doc, startX, yPosition) => {
  // Add stamp first (positioned above signature)
  doc.image(
    SIGNATURE_CONFIG.stamp.path,
    startX + 20,
    yPosition + 60,
    {
      width: SIGNATURE_CONFIG.stamp.width,
      height: SIGNATURE_CONFIG.stamp.height
    }
  );

  // Add signature (overlapping with stamp)
  doc.image(
    SIGNATURE_CONFIG.signature.path,
    startX + 60,
    yPosition + 45,
    {
      width: SIGNATURE_CONFIG.signature.width,
      height: SIGNATURE_CONFIG.signature.height
    }
  );
};

module.exports = { addSignatureImages, SIGNATURE_CONFIG };