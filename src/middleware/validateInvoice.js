const Joi = require('joi');

const invoiceSchema = Joi.object({
  template: Joi.string().valid('modern', 'classic').default('classic'),
  language: Joi.string().valid('en', 'id').default('en'),
  invoiceNumber: Joi.string().required(),
  invoiceDate: Joi.date().required(),
  dueIn: Joi.number().required(),
  customerName: Joi.string().required(),
  customerRecipient: Joi.string().required(),
  customerAddress: Joi.string().required(),
  percentageGrossUp: Joi.number().required(),
  grossUpInAdvance: Joi.boolean().required(),
  withSignature: Joi.boolean().required(),
  items: Joi.array().items(
    Joi.object({
      description: Joi.string().required(),
      quantity: Joi.number().positive().required(),
      price: Joi.number().positive().required()
    })
  ).min(1).required()
});

const validateInvoice = (req, res, next) => {
  const { error, value } = invoiceSchema.validate(req.body);
  
  if (error) {
    return res.status(400).json({
      status: 'error',
      message: error.details[0].message
    });
  }
  
  req.body = value; // Use validated and defaulted values
  next();
};

module.exports = validateInvoice;