const express = require('express');
const router = express.Router();
const ProgramacaoController = require('../controllers/ProgramacaoController');

router.get('/', ProgramacaoController.getProgramacao);

module.exports = router;