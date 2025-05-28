// routes/comercialRoutes.js
const express    = require('express');
const Comercial  = require('../models/ComercialModel');
const router     = express.Router();

// GET /api/comerciais
router.get('/', async (req, res) => {
  const lista = await Comercial.find().sort({ ordem: 1 }).lean();
  res.json(lista);
});

// POST /api/comerciais
router.post('/', async (req, res) => {
  const c = new Comercial(req.body);
  await c.save();
  res.status(201).json(c);
});

// PUT /api/comerciais/:id
router.put('/:id', async (req, res) => {
  const c = await Comercial.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );
  if (!c) return res.status(404).json({ erro: 'Não encontrado' });
  res.json(c);
});

// DELETE /api/comerciais/:id
router.delete('/:id', async (req, res) => {
  const c = await Comercial.findByIdAndDelete(req.params.id);
  if (!c) return res.status(404).json({ erro: 'Não encontrado' });
  res.status(204).end();
});

module.exports = router;
