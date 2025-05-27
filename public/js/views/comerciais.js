import { api } from '../services/api.js';
export async function renderComerciais(){
  const app = document.getElementById('app');
  app.innerHTML=`
    <h1>📣 Comerciais</h1>
    <ul id="list"></ul>
    <h2>Adicionar/Editar Comercial</h2>
    <form id="form">
      <input type="hidden" id="id">
      <input type="text" id="nome" placeholder="Nome" required>
      <input type="number" id="ordem" placeholder="Ordem" required>
      <button type="submit">Salvar</button>
    </form>
  `;
  const form=document.getElementById('form');
  async function carreg(){
    const items=await api.getComerciais();
    const ul=document.getElementById('list'); ul.innerHTML='';
    items.forEach(c=>{
      const li=document.createElement('li');
      li.textContent=`${c.ordem} - ${c.nome}`;
      const btnE=document.createElement('button'); btnE.textContent='✏️';
      btnE.onclick=()=>{document.getElementById('id').value=c._id;document.getElementById('nome').value=c.nome;document.getElementById('ordem').value=c.ordem;};
      const btnD=document.createElement('button'); btnD.textContent='🗑️';
      btnD.onclick=async()=>{await api.delCom(c._id);carreg();};
      li.append(' ',btnE,' ',btnD);
      ul.append(li);
    });
  }
  form.onsubmit=async e=>{
    e.preventDefault();
    const id=document.getElementById('id').value;
    const data={ nome: document.getElementById('nome').value, ordem:+document.getElementById('ordem').value };
    if(id) await api.updCom(id,data); else await api.addCom(data);
    form.reset();carreg();
  };
  carreg();
}