const templates = {
    classic: require('../templates/classic.template'),
    modern: require('../templates/modern.template')
  };
  
  const getTemplate = (templateName) => {
    const template = templates[templateName];
    if (!template) {
      throw new Error(`Template '${templateName}' not found. Available templates: ${Object.keys(templates).join(', ')}`);
    }
    return template;
  };
  
  const listTemplates = () => {
    return Object.keys(templates);
  };
  
  module.exports = {
    getTemplate,
    listTemplates
  };