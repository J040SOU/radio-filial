// server.js
const express           = require('express');
const mongoose          = require('mongoose');
const path              = require('path');
const cors              = require('cors');

const comercialRoutes   = require('./routes/comercialRoutes');
const streamProxy       = require('./routes/streamProxy');

const app = express();
app.use(cors());
app.use(express.json());

// CRUD comerciais
app.use('/api/comerciais', comercialRoutes);

// proxy de stream
app.use('/api', streamProxy);

// front‑end estático
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect('mongodb://localhost:27017/radio_filial')
  .then(() => {
    console.log('✅ Filial conectado ao MongoDB em mongodb://localhost:27017/radio_filial');
    app.listen(4000, () =>
      console.log('🚀 Rádio Filial em http://localhost:4000')
    );
  })
  .catch(err => console.error(err));
