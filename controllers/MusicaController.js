const { listarMusicas } = require('../services/MatrizService');
async function getMusicas(req, res) {
  try { res.json(await listarMusicas()); }
  catch (e) { res.status(500).json({ erro: e.message }); }
}
module.exports = { getMusicas };