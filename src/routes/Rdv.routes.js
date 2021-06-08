const express = require('express');

const rdvRoutes = express.Router();
const {
  createRdv,
  addRdv,
  rdvDuJour,
} = require('../controllers/Rdv.controllers');

rdvRoutes.get('/dayrdv', rdvDuJour);
rdvRoutes.post('/createrdv', createRdv);
rdvRoutes.post('/addrdv/:id', addRdv);

module.exports = rdvRoutes;
