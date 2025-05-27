const Comercial = require('../models/ComercialModel');
const seed = require('../data/comerciais');
async function listar() {
  if (await Comercial.countDocuments() === 0) {
    await Comercial.insertMany(seed);
  }
  // .lean() faz com que retorne JS puro, sem metadados do Mongoose
  return Comercial.find().sort({ ordem: 1 }).lean();
}
async function adicionar(d) { return Comercial.create(d); }
async function atualizar(id, d) { return Comercial.findByIdAndUpdate(id, d, { new: true }); }
async function remover(id) { return Comercial.findByIdAndDelete(id); }
module.exports = { listar, adicionar, atualizar, remover };