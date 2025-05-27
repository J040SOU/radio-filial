const { listarMusicas } = require('../services/MatrizService');
const { listar: listarComerciais } = require('../services/ComercialService');

function intercalar(mus, com) {
  const grp = {};
  mus.forEach(m => {
    (grp[m.ordem] = grp[m.ordem] || { mus: [], com: [] }).mus.push(m);
  });
  com.forEach(c => {
    (grp[c.ordem] = grp[c.ordem] || { mus: [], com: [] }).com.push(c);
  });
  return Object.keys(grp)
    .map(Number)
    .sort((a, b) => a - b)
    .flatMap(o => [
      ...grp[o].mus.map(m => ({ tipo: 'musica', ...m })),
      ...grp[o].com.map(c => ({ tipo: 'comercial', ...c }))
    ]);
}

async function getProg(req, res) {
  try {
    const mus = await listarMusicas();        // já plain objects
    const com = await listarComerciais();     // agora plain objects
    return res.json(intercalar(mus, com));
  } catch (e) {
    console.error(e);
    return res.status(500).json({ erro: e.message });
  }
}

module.exports = { getProg };
