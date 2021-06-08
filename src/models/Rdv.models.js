const mongoose = require('mongoose');

const { Schema, model } = mongoose;

const rdvSchema = Schema({
  num_rdv: {
    type: String,
    required: true,
  },
  heur_rdv: {
    type: String,
    required: true,
  },
  rdv_honorer: {
    type: Boolean,
    required: true,
    default: false,
  },
  id_personne: {
    type: Schema.Types.ObjectId,
    ref: 'personne',
  },
  date_rdv: {
    type: Date,
    required: true,
  },
});

module.exports = model('rdv', rdvSchema);
