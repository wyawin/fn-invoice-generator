const Joi = require('joi');

const invoiceSchema = Joi.object({
  customerName: Joi.string().required(),
  customerAddress: Joi.string().required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required()
});

const validateInvoice = (req, res, next) => {
  const { error } = invoiceSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message
    });
  }
  
  next();
};

module.exports = validateInvoice;