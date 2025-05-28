const BASE = 'http://localhost:4000/api';

export const api = {
  getComerciais: () => fetch(`${BASE}/comerciais`).then(r=>r.json()),
  addCom: d        => fetch(`${BASE}/comerciais`,  { method:'POST', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }),
  updateCom: (id,d)=> fetch(`${BASE}/comerciais/${id}`, { method:'PUT', headers:{'Content-Type':'application/json'}, body:JSON.stringify(d) }),
  delCom: id       => fetch(`${BASE}/comerciais/${id}`, { method:'DELETE' }),
  getMusicas: ()=> Promise.resolve([]), // não gerencia músicas na filial
  getProgramacao: ()=> Promise.resolve([]) // não usamos tabela aqui
};
