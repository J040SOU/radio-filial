const mongoose = require('mongoose');

const comercialSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  ordem: { type: Number, required: true }
});

module.exports = mongoose.model('Comercial', comercialSchema);