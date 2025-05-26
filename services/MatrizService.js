const axios = require('axios');

async function listarMusicas() {
  const res = await axios.get('http://localhost:3000/playlist');
  return res.data; // array com { nome, ordem }
}

module.exports = { listarMusicas };