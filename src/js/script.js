import { gerarCartas } from './gerar_cartas.js';
import { iniciarViradaCartas } from './virar_cartas.js';

const containerCartas = document.querySelector('.container_cartas');
const containerConfig = document.querySelector('.container_config');
const button = document.querySelector('.button button');

// Chamada da função para gerar as cartas no container ao carregar o jogo
gerarCartas();
iniciarViradaCartas();