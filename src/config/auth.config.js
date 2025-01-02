// Get API keys from environment variables
const API_KEYS = process.env.API_KEYS ? process.env.API_KEYS.split(',') : [];

if (API_KEYS.length === 0) {
  console.warn('Warning: No API keys configured. Set API_KEYS environment variable.');
}

module.exports = {
  API_KEYS
};