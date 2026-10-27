import { gerarCartas } from './gerar_cartas.js';
import { iniciarViradaCartas } from './virar_cartas.js';
import { iniciarDificuldade } from './dificuldade.js';
import {
  iniciarCronometro,
  pausarCronometro,
  retomarCronometro,
  reiniciarCronometro
} from './cronometro.js';
import {
  iniciarContabilizacao,
  reiniciarContabilizacao
} from './contabilizar_pontos.js';
import {
  esconderCartasNaoEncontradas,
  reiniciarEstadoCartas
} from './virar_cartas.js';
import { iniciarPlacar } from './placar.js';
import { iniciarQuiz, reiniciarQuiz } from './quiz.js';
import { iniciarLogin } from './login.js';
import { iniciarPopups } from './popups.js';
import { iniciarStreak, reiniciarStreak } from './streak.js';

// Chamada da função para gerar as cartas no container ao carregar o jogo
gerarCartas();
iniciarViradaCartas();
iniciarDificuldade();
iniciarCronometro();
iniciarContabilizacao();
iniciarPlacar();
iniciarQuiz();
iniciarLogin();
iniciarPopups();
iniciarStreak();

document.querySelector('#pausar-jogo')?.addEventListener('click', (evento) => {
  const botao = evento.currentTarget;
  if (pausarCronometro()) {
    esconderCartasNaoEncontradas();
    botao.textContent = 'Continuar';
  } else if (retomarCronometro()) {
    botao.textContent = 'Pausar';
  }
});

document.addEventListener('memory:card-clicked', () => {
  const botao = document.querySelector('#pausar-jogo');
  if (!botao) return;

  retomarCronometro();
  botao.textContent = 'Pausar';
});

document.querySelector('#reiniciar-jogo')?.addEventListener('click', () => {
  reiniciarEstadoCartas();
  reiniciarCronometro();
  reiniciarContabilizacao();
  reiniciarQuiz();
  reiniciarStreak();
  gerarCartas();

  const botaoPausar = document.querySelector('#pausar-jogo');
  if (botaoPausar) botaoPausar.textContent = 'Pausar';
});
