// models/ComercialModel.js
const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  nome:  { type: String, required: true }, // ex: 'spot1.mp3'
  ordem: { type: Number, required: true }, // determina o intervalo correspondente
  active:{ type: Boolean, default: true }
});

module.exports = mongoose.model('Comercial', schema);
