import { api } from '../services/api.js';
export async function renderProgramacao(){
  const prog = await api.getProg();
  document.getElementById('app').innerHTML = `
    <h1>📋 Programação</h1>
    <ul>${prog.map(p=>`<li>[${p.tipo}] ${p.ordem} - ${p.nome}</li>`).join('')}</ul>`;
}