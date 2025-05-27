const BASE = 'http://localhost:4000/api';
export const api = {
  getMusicas: ()=>fetch(`${BASE}/musicas`).then(r=>r.json()),
  getComerciais: ()=>fetch(`${BASE}/comerciais`).then(r=>r.json()),
  addCom: d=>fetch(`${BASE}/comerciais`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}),
  updCom: (id,d)=>fetch(`${BASE}/comerciais/${id}`,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(d)}),
  delCom: id=>fetch(`${BASE}/comerciais/${id}`,{method:'DELETE'}),
  getProg: ()=>fetch(`${BASE}/programacao`).then(r=>r.json())
};