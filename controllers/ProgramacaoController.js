const { listarMusicas } = require('../services/MatrizService');
const { listarComerciais } = require('../services/ComercialService');

async function getProgramacao(req, res) {
  try {
    // Busca os arrays puros de músicas e comerciais
    const musicas = await listarMusicas();       // [{ _id, nome, ordem }, …]
    const comerciais = await listarComerciais(); // Mongoose Docs

    // Converte comerciais em objetos JS simples
    const comDocs = comerciais.map(c => ({
      _id: c._doc._id,
      nome: c._doc.nome,
      ordem: c._doc.ordem
    }));

    // Junta tudo em um único array indexado pela ordem
    const agrupados = {};
    musicas.forEach(m => {
      agrupados[m.ordem] = agrupados[m.ordem] || { musicas: [], comerciais: [] };
      agrupados[m.ordem].musicas.push(m);
    });
    comDocs.forEach(c => {
      agrupados[c.ordem] = agrupados[c.ordem] || { musicas: [], comerciais: [] };
      agrupados[c.ordem].comerciais.push(c);
    });

    // Ordena as chaves (números de ordem) e monta a lista final
    const ordens = Object.keys(agrupados)
      .map(Number)
      .sort((a, b) => a - b);

    const programacao = [];
    for (const o of ordens) {
      // primeiro todas as músicas desta ordem
      agrupados[o].musicas.forEach(m => {
        programacao.push({ tipo: 'musica', _id: m._id, nome: m.nome, ordem: m.ordem });
      });
      // depois todos os comerciais desta ordem
      agrupados[o].comerciais.forEach(c => {
        programacao.push({ tipo: 'comercial', _id: c._id, nome: c.nome, ordem: c.ordem });
      });
    }

    return res.json(programacao);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ erro: 'Erro ao gerar programação' });
  }
}

module.exports = { getProgramacao };
