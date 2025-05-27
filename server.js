const express = require('express'), mongoose = require('mongoose'), cors = require('cors'),
  path = require('path');
const musicas = require('./routes/musicaRoutes');
const comerciais = require('./routes/comercialRoutes');
const prog = require('./routes/programacaoRoutes');
const app = express();
app.use(cors(), express.json());
app.use('/api/musicas', musicas);
app.use('/api/comerciais', comerciais);
app.use('/api/programacao', prog);
app.use(express.static(path.join(__dirname,'public')));
const url = process.env.MONGO_URL||'mongodb://localhost:27017/radio_filial';
mongoose.connect(url).then(_=>{
  console.log(`✅ Mongo em ${url}`);
  app.listen(4000,()=>console.log('🚀 Servidor em http://localhost:4000'));
}).catch(e=>console.error(e));