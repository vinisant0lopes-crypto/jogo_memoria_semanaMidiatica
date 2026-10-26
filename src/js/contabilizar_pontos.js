import { obterMultiplicadorStreak } from './streak.js';

let tentativas = 0;
let pontos = 0;
let respostasQuiz = 0;

function atualizarTela() {
  const tentativasElemento = document.querySelector('#tentativas');
  const pontosElemento = document.querySelector('#pontos');

  if (tentativasElemento) tentativasElemento.textContent = String(tentativas);
  if (pontosElemento) pontosElemento.textContent = String(pontos);
  const quizElemento = document.querySelector('#quiz_respostas');
  if (quizElemento) quizElemento.textContent = String(respostasQuiz);
}

export function iniciarContabilizacao() {
  document.addEventListener('memory:attempt', () => {
    tentativas += 1;
    atualizarTela();
  });

  document.addEventListener('memory:pair-result', (evento) => {
    if (evento.detail.correto) {
      pontos += Math.round(10 * obterMultiplicadorStreak());
      atualizarTela();
    }
  });

  document.addEventListener('quiz:answer-result', (evento) => {
    if (evento.detail.correta) {
      respostasQuiz += 1;
      atualizarTela();
    }
  });
}

export function reiniciarContabilizacao() {
  tentativas = 0;
  pontos = 0;
  respostasQuiz = 0;
  atualizarTela();
}

export function obterEstatisticasAtuais() {
  return { tentativas, pontos };
}