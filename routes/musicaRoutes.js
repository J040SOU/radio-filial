const r = require('express').Router();
const c = require('../controllers/MusicaController');
r.get('/', c.getMusicas);
module.exports = r;