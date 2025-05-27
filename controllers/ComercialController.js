const svc = require('../services/ComercialService');
async function get(req, res) { res.json(await svc.listar()); }
async function post(req, res) { res.status(201).json(await svc.adicionar(req.body)); }
async function put(req, res)  { res.json(await svc.atualizar(req.params.id, req.body)); }
async function del(req, res) { await svc.remover(req.params.id); res.status(204).end(); }
module.exports = { get, post, put, del };