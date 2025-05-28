import { renderHome } from './views/home.js';
import { renderMusicas } from './views/musicas.js';
import { renderComerciais } from './views/comerciais.js';
import { renderProgramacao } from './views/programacao.js';

const routes = {
  '#home': renderHome,
  '#musicas': renderMusicas,
  '#comerciais': renderComerciais,
  '#programacao': renderProgramacao
};

export function router() {
  const hash = window.location.hash || '#home';
  (routes[hash] || renderHome)();
}
