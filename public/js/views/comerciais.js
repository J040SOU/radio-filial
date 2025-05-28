import { api } from '../services/api.js';

export async function renderComerciais() {
  const app = document.getElementById('app');
  app.innerHTML = `
    <h1>Comerciais</h1>
    <ul id="list"></ul>
    <h2>Adicionar Comercial</h2>
    <form id="f">
      <input type="text" id="nome" placeholder="nome.mp3" required>
      <input type="number" id="ordem" placeholder="Ordem" required>
      <button>Salvar</button>
    </form>
  `;

  const ul = document.getElementById('list');
  async function load() {
    ul.innerHTML = '';
    const lista = await api.getComerciais();
    lista.forEach(c => {
      const li = document.createElement('li');
      li.textContent = `${c.ordem} - ${c.nome}`;
      const e = document.createElement('button'); e.textContent = '✏️';
      const d = document.createElement('button'); d.textContent = '🗑️';
      e.onclick = async () => {
        document.getElementById('nome').value  = c.nome;
        document.getElementById('ordem').value = c.ordem;
        f.dataset.edit = c._id;
      };
      d.onclick = async () => {
        await api.delCom(c._id);
        load();
      };
      li.append(' ',e,' ',d);
      ul.append(li);
    });
  }

  const f = document.getElementById('f');
  f.onsubmit = async e => {
    e.preventDefault();
    const data = { nome: nome.value, ordem: parseInt(ordem.value,10) };
    if (f.dataset.edit) {
      await api.updateCom(f.dataset.edit, data);
      delete f.dataset.edit;
    } else {
      await api.addCom(data);
    }
    f.reset();
    load();
  };

  load();
}
