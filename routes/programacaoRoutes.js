const r = require('express').Router();
const c = require('../controllers/ProgramacaoController');
r.get('/', c.getProg);
module.exports = r;