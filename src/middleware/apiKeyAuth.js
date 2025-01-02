const { API_KEYS } = require('../config/auth.config');

const validateApiKey = (req, res, next) => {
  // Ensure API keys are configured
  if (API_KEYS.length === 0) {
    return res.status(500).json({
      status: 'error',
      message: 'API key validation not configured'
    });
  }

  const apiKey = req.header('x-api-key');

  if (!apiKey) {
    return res.status(401).json({
      status: 'error',
      message: 'API key is missing'
    });
  }

  if (!API_KEYS.includes(apiKey)) {
    return res.status(403).json({
      status: 'error',
      message: 'Invalid API key'
    });
  }

  next();
};

module.exports = validateApiKey;