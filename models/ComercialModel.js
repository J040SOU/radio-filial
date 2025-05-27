const mongoose = require('mongoose');
const schema = new mongoose.Schema({ nome: String, ordem: Number });
module.exports = mongoose.model('Comercial', schema);