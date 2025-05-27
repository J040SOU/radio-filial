import { api } from '../services/api.js';
export async function renderMusicas(){
  const mus = await api.getMusicas();
  document.getElementById('app').innerHTML = `
    <h1>🎵 Músicas Recebidas</h1>
    <ul>${mus.map(m=>`<li>${m.ordem} - ${m.nome}</li>`).join('')}</ul>`;
}