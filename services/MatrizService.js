// services/MatrizService.js
const axios = require('axios');

async function listarMusicas() {
  const res = await axios.get('http://localhost:3000/api/playlist');
  return res.data; // [{ _id, nome, ordem }, …]
}

module.exports = { listarMusicas };
