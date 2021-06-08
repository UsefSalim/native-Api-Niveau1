const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const personneSchema = Schema({
  nom: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 48,
  },
  prenom: {
    type: String,
    required: true,
    minLength: 2,
    maxLength: 48,
  },
  cin: {
    type: String,
    required: true,
    minLength: 7,
    maxLength: 8,
  },
  date_naissance: {
    type: String,
    required: true,
  },
});

module.exports = model('personne', personneSchema);
