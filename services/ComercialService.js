const Comercial = require('../models/ComercialModel');
const seed = require('../data/comerciais');

async function listarComerciais() {
  // popular se vazio
  const count = await Comercial.countDocuments();
  if (count === 0) {
    await Comercial.insertMany(seed);
  }
  return Comercial.find().sort({ ordem: 1 });
}

module.exports = { listarComerciais };