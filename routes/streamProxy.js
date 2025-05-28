const pkg = require('eventsource');
console.log('EventSource pkg:', pkg);


// routes/streamProxy.js
const express     = require('express');
const ESpkg       = require('eventsource');
const EventSource = ESpkg.default || ESpkg;  // garante o construtor
const fetch       = require('node-fetch');
const fs          = require('fs');
const path        = require('path');
const Comercial   = require('../models/ComercialModel');

const router   = express.Router();
const MAT_HOST = 'http://localhost:3000';

let comercialQueue = [];
let abortController = null;

// 1) SSE: enfileirar intervalos e abortar fetch em andamento
;(function startSSE() {
  console.log('[Filial] Conectando SSE em', `${MAT_HOST}/api/events`);
  const es = new EventSource(`${MAT_HOST}/api/events`);

  es.addEventListener('play', e => {
    console.log('[Filial][SSE] play', e.data);
  });

  es.addEventListener('interval', e => {
    const { ordem, durationSec } = JSON.parse(e.data);
    console.log('[Filial][SSE] interval', e.data);
    comercialQueue.push({ ordem, durationSec });
    // interrompe o fetch atual da música, se existir
    if (abortController) {
      console.log('[Filial] Abortando música em curso para tocar comercial');
      abortController.abort();
    }
  });

  es.onerror = () => {
    console.warn('[Filial][SSE] erro SSE, reconectando em 3s');
    setTimeout(startSSE, 3000);
  };
})();

// 2) Proxy de streaming
router.get('/stream', (req, res) => {
  console.log('[Filial] Cliente conectado em /api/stream');
  res.set({
    'Content-Type':      'audio/mpeg',
    'Transfer-Encoding': 'chunked'
  });

  req.on('close', () => console.log('[Filial] Cliente desconectou'));

  (async function proxyLoop() {
    while (!res.writableEnded) {
      // 2.1) Se há comercial na fila, toca ele antes de qualquer música
      if (comercialQueue.length > 0) {
        const { ordem } = comercialQueue.shift();
        console.log('[Filial] Tocando comercial ordem', ordem);
        const com = await Comercial.findOne({ ordem, active: true }).lean();
        if (com && com.nome) {
          const filename = com.nome.endsWith('.mp3') ? com.nome : `${com.nome}.mp3`;
          const filePath = path.join(__dirname, '..', 'comerciais', filename);
          if (fs.existsSync(filePath)) {
            const stream = fs.createReadStream(filePath);
            for await (const chunk of stream) {
              if (res.writableEnded) break;
              res.write(chunk);
            }
            stream.destroy();
            console.log('[Filial] Comercial finalizado');
          } else {
            console.error('[Filial] Arquivo não existe:', filePath);
          }
        } else {
          console.warn('[Filial] Nenhum comercial ativo p/ ordem', ordem);
        }
        continue; // volta ao topo do loop: antes de tocar música, checa fila novamente
      }

      // 2.2) Caso contrário, repassar música da Matriz
      console.log('[Filial] Repassando música da Matriz');
      abortController = new AbortController();
      try {
        const m = await fetch(`${MAT_HOST}/api/stream/msc`, {
          signal: abortController.signal
        });
        for await (const chunk of m.body) {
          if (res.writableEnded) break;
          // se vier um novo comercial, abortController abortará e cairá no catch
          res.write(chunk);
        }
      } catch (err) {
        if (err.name === 'AbortError') {
          console.log('[Filial] Fetch abortado — entrando em comercial');
        } else {
          console.error('[Filial] Erro durante fetch:', err.message);
          // em caso de erro de rede, aguarde 500ms para re-tentar
          await new Promise(r => setTimeout(r, 500));
        }
      } finally {
        abortController = null;
      }
    }
    console.log('[Filial] Conexão finalizada, encerrando stream');
    res.end();
  })();
});

module.exports = router;
