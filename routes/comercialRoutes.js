const r = require('express').Router();
const c = require('../controllers/ComercialController');
r.get('/', c.get);
r.post('/', c.post);
r.put('/:id', c.put);
r.delete('/:id', c.del);
module.exports = r;