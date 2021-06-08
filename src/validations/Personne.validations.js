const Joi = require('joi');

exports.PersonneValidations = (data) => {
  const schema = Joi.object({
    date_naissance: Joi.date().required(),
    cin: Joi.string().required().min(7).max(8).trim(),
    prenom: Joi.string().required().min(2).max(48).trim(),
    nom: Joi.string().required().min(2).max(48).trim(),
  });

  return schema.validate(data);
};
