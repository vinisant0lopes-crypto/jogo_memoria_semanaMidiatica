import {
  definirQuantidadePares,
  gerarCartas
} from './gerar_cartas.js';
import { reiniciarEstadoCartas } from './virar_cartas.js';
import { reiniciarCronometro } from './cronometro.js';
import { reiniciarContabilizacao } from './contabilizar_pontos.js';

const paresPorDificuldade = {
  facil: 6,
  medio: 12,
  dificil: 16,
  edificil: 18
};

function fecharOpcoes(botao, opcoes) {
  opcoes.hidden = true;
  botao.setAttribute('aria-expanded', 'false');
}

export function iniciarDificuldade() {
  const container = document.querySelector('.button_dificuldade');
  if (!container) return;

  const botao = container.querySelector('button');
  const opcoes = container.querySelector('.opcao');
  if (!botao || !opcoes) return;

  botao.addEventListener('click', () => {
    opcoes.hidden = !opcoes.hidden;
    botao.setAttribute('aria-expanded', String(!opcoes.hidden));
  });

  opcoes.addEventListener('click', (evento) => {
    const opcao = evento.target.closest('[data-dificuldade]');
    if (!opcao) return;

    const quantidade = paresPorDificuldade[opcao.dataset.dificuldade];
    if (!quantidade) return;

    definirQuantidadePares(quantidade);
    reiniciarEstadoCartas();
    reiniciarCronometro();
    reiniciarContabilizacao();
    gerarCartas();
    fecharOpcoes(botao, opcoes);
  });

  document.addEventListener('click', (evento) => {
    if (!container.contains(evento.target)) {
      fecharOpcoes(botao, opcoes);
    }
  });
}
