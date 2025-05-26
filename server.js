const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const programacaoRoutes = require('./routes/programacaoRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/programacao', programacaoRoutes);
app.get('/', (req, res) => res.redirect('/programacao'));

const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost:27017/radio_filial';
mongoose.connect(mongoUrl)
  .then(() => {
    console.log(`✅ Conectado ao MongoDB: ${mongoUrl}`);
    app.listen(4000, () => console.log('🚀 Filial rodando em http://localhost:4000'));
  })
  .catch(err => console.error('❌ Erro ao conectar MongoDB', err));