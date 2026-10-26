let inicio = null;
let intervalo = null;
let pausadoEm = 0;

function formatarTempo(tempoEmMilissegundos) {
  const milissegundos = Math.floor(tempoEmMilissegundos);
  const minutos = Math.floor(milissegundos / 60000);
  const segundos = Math.floor((milissegundos % 60000) / 1000);
  const restanteMilissegundos = milissegundos % 1000;

  return [
    String(minutos).padStart(2, '0'),
    String(segundos).padStart(2, '0'),
    String(restanteMilissegundos).padStart(3, '0')
  ].join(':');
}

function atualizarTela() {
  const elemento = document.querySelector('#tempo');
  if (!elemento) return;

  const tempoAtual = inicio === null ? pausadoEm : pausadoEm + performance.now() - inicio;
  elemento.textContent = formatarTempo(tempoAtual);
}

function iniciar() {
  if (inicio !== null || intervalo !== null) return;

  inicio = performance.now();
  intervalo = window.setInterval(atualizarTela, 10);
}

export function iniciarCronometro() {
  document.addEventListener('memory:first-card', iniciar);
  document.addEventListener('quiz:finished', (evento) => {
    if (evento.detail.concluido) pararCronometro();
  });
}

export function pausarCronometro() {
  if (inicio === null) return false;

  pausadoEm += performance.now() - inicio;
  inicio = null;
  window.clearInterval(intervalo);
  intervalo = null;
  atualizarTela();
  return true;
}

export function retomarCronometro() {
  if (inicio !== null || pausadoEm === 0) return false;
  inicio = performance.now();
  intervalo = window.setInterval(atualizarTela, 10);
  return true;
}

export function pararCronometro() {
  if (inicio !== null) {
    pausadoEm += performance.now() - inicio;
  }
  inicio = null;
  window.clearInterval(intervalo);
  intervalo = null;
  atualizarTela();
}

export function reiniciarCronometro() {
  inicio = null;
  pausadoEm = 0;
  window.clearInterval(intervalo);
  intervalo = null;

  const elemento = document.querySelector('#tempo');
  if (elemento) elemento.textContent = '00:00:000';
}

export function obterTempoAtual() {
  return inicio === null ? pausadoEm : pausadoEm + performance.now() - inicio;
}