export function renderHome() {
  document.getElementById('app').innerHTML = `<h1>Bem‑vindo à Rádio Filial</h1>
    <p>Para ouvir, use ffplay http://localhost:4000/api/stream</p>`;
}
