// services/ComercialService.js
const Comercial = require('../models/ComercialModel');

async function listarComerciais() {
  // só os que estiverem active=true, ordenados
  return Comercial.find({ active: true })
                  .sort({ ordem: 1 })
                  .lean(); 
}

module.exports = { listarComerciais };
