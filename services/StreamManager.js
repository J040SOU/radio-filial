// services/StreamManager.js
const fs     = require('fs');
const path   = require('path');
const EventEmitter = require('events');
const { listarMusicas }    = require('./MatrizService');
const { listarComerciais } = require('./ComercialService');

class StreamManager extends EventEmitter {
  constructor() {
    super();
    this.clients = new Set();
    this.playlist = [];
    this.comerciais = [];
    this.queue = [];
    this.index = 0;
    this.playing = false;
  }

  async init() {
    // carrega músicas + comerciais e monta fila
    this.playlist = await listarMusicas();
    this.comerciais = await listarComerciais();
    // intercalar: todas as músicas de cada ordem, depois o comercial da mesma ordem
    const grouped = {};
    this.playlist.forEach(m => {
      grouped[m.ordem] = grouped[m.ordem] || { mus: [], com: [] };
      grouped[m.ordem].mus.push(m);
    });
    this.comerciais.forEach(c => {
      grouped[c.ordem] = grouped[c.ordem] || { mus: [], com: [] };
      grouped[c.ordem].com.push(c);
    });
    this.queue = Object.keys(grouped)
      .map(Number)
      .sort((a,b) => a - b)
      .flatMap(o => [
        ...grouped[o].mus.map(m => ({ tipo:'musica',  nome:m.nome })),
        ...grouped[o].com.map(c => ({ tipo:'comercial', nome:c.nome }))
      ]);
  }

  addClient(res) {
    // cabeçalhos MP3 chunked
    res.set({
      'Content-Type':      'audio/mpeg',
      'Transfer-Encoding': 'chunked'
    });
    this.clients.add(res);
    res.on('close', () => {
      this.clients.delete(res);
      if (this.clients.size === 0) this.playing = false;
    });
    if (!this.playing) this._startLoop();
  }

  async _startLoop() {
    this.playing = true;
    // se não inicializado, carrega a fila
    if (this.queue.length === 0) {
      await this.init();
    }
    while (this.playing) {
      const item = this.queue[this.index];
      const filePath = path.join(
        __dirname, '..', 
        item.tipo === 'musica' ? 'musicas' : 'comerciais',
        `${item.nome}`
      );
      await this._streamFile(filePath);
      this.index = (this.index + 1) % this.queue.length;
    }
  }

  _streamFile(filePath) {
    return new Promise(resolve => {
      if (!fs.existsSync(filePath)) {
        return resolve(); // pula se não existir
      }
      const stream = fs.createReadStream(filePath);
      stream.on('data', chunk => {
        for (const res of this.clients) res.write(chunk);
      });
      stream.on('end', () => resolve());
      stream.on('error', () => resolve());
    });
  }
}

module.exports = new StreamManager();
