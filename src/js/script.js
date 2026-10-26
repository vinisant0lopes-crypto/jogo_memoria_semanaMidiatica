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
import { reiniciarEstadoCartas } from './virar_cartas.js';
import { iniciarPlacar } from './placar.js';
import { iniciarQuiz, reiniciarQuiz } from './quiz.js';
import { iniciarLogin } from './login.js';
import { iniciarPopups } from './popups.js';

gerarCartas();
iniciarViradaCartas();
iniciarDificuldade();
iniciarCronometro();
iniciarContabilizacao();
iniciarPlacar();
iniciarQuiz();
iniciarLogin();
iniciarPopups();

document.querySelector('#pausar-jogo')?.addEventListener('click', (evento) => {
  const botao = evento.currentTarget;
  if (pausarCronometro()) {
    botao.textContent = 'Continuar';
  } else if (retomarCronometro()) {
    botao.textContent = 'Pausar';
  }
});

document.querySelector('#reiniciar-jogo')?.addEventListener('click', () => {
  reiniciarEstadoCartas();
  reiniciarCronometro();
  reiniciarContabilizacao();
  reiniciarQuiz();
  gerarCartas();

  const botaoPausar = document.querySelector('#pausar-jogo');
  if (botaoPausar) botaoPausar.textContent = 'Pausar';
});
