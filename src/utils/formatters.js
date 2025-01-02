const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0, 
    minimumFractionDigits: 0, 
  }).format(amount);
};

const formatDate = (date, language) => {
  return new Intl.DateTimeFormat(`${language}-US`, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date));
};

module.exports = {
  formatCurrency,
  formatDate
};