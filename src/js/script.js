import { gerarCartas } from './gerar_cartas.js';
import { iniciarViradaCartas } from './virar_cartas.js';
import { reiniciarCronometro } from './cronometro.js';
import { reiniciarPontuacao } from './contabilizar_pontos.js'; 

const containerCartas = document.querySelector('.container_cartas');
const containerConfig = document.querySelector('.container_config');
const btnReiniciar = document.querySelector('.button button'); 

gerarCartas();
iniciarViradaCartas();

if (btnReiniciar) {
    btnReiniciar.addEventListener('click', () => {
        reiniciarCronometro();
        reiniciarPontuacao();
        gerarCartas();
        iniciarViradaCartas();
    });
}