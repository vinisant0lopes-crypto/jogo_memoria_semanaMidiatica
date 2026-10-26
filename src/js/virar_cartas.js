const TEMPO_VERIFICACAO = 800;
const TEMPO_BORDA = 300;

let cartasSelecionadas = [];
let cartasEncontradas = new Set();
let verificandoPar = false;

export function reiniciarEstadoCartas() {
  cartasSelecionadas = [];
  cartasEncontradas = new Set();
  verificandoPar = false;
}

function virarCarta(carta) {
  carta.classList.add('virada');
  carta.setAttribute('aria-label', 'Carta revelada');

  carta.querySelector('.carta__verso').setAttribute('aria-hidden', 'true');
  carta.querySelector('.carta__frente').setAttribute('aria-hidden', 'false');
}

function esconderCarta(carta) {
  carta.classList.remove('virada');
  carta.setAttribute('aria-label', 'Carta escondida');

  carta.querySelector('.carta__verso').setAttribute('aria-hidden', 'false');
  carta.querySelector('.carta__frente').setAttribute('aria-hidden', 'true');
}

function finalizarVerificacao(cartaA, cartaB) {
  const mesmoPar = cartaA.dataset.nome === cartaB.dataset.nome;

  if (mesmoPar) {
    cartaA.classList.add('par-correto');
    cartaB.classList.add('par-correto');
    cartasEncontradas.add(cartaA);
    cartasEncontradas.add(cartaB);
    verificandoPar = false;
    document.dispatchEvent(
      new CustomEvent('memory:pair-result', {
        detail: {
          correto: true,
          nome: cartaA.dataset.nome,
          concluido:
            cartasEncontradas.size ===
            document.querySelector('.subcontainer_cartas').children.length
        }
      })
    );
  } else {
    cartaA.classList.add('par-errado');
    cartaB.classList.add('par-errado');

    window.setTimeout(() => {
      esconderCarta(cartaA);
      esconderCarta(cartaB);
      cartaA.classList.remove('par-errado');
      cartaB.classList.remove('par-errado');
      verificandoPar = false;
      document.dispatchEvent(
        new CustomEvent('memory:pair-result', {
          detail: { correto: false, concluido: false }
        })
      );
    }, TEMPO_BORDA);
  }

  cartasSelecionadas = [];
}

function lidarComClique(evento) {
  const carta = evento.target.closest('.carta');
  if (!carta || !carta.closest('.subcontainer_cartas')) return;

  if (
    verificandoPar ||
    cartasEncontradas.has(carta) ||
    cartasSelecionadas.includes(carta)
  ) {
    return;
  }

  virarCarta(carta);
  cartasSelecionadas.push(carta);

  if (cartasSelecionadas.length === 1) {
    document.dispatchEvent(new CustomEvent('memory:first-card'));
  }

  if (cartasSelecionadas.length === 2) {
    document.dispatchEvent(new CustomEvent('memory:attempt'));
    verificandoPar = true;
    const [cartaA, cartaB] = cartasSelecionadas;
    window.setTimeout(
      () => finalizarVerificacao(cartaA, cartaB),
      TEMPO_VERIFICACAO
    );
  }
}

function lidarComTeclado(evento) {
  if (evento.key !== 'Enter' && evento.key !== ' ') return;

  const carta = evento.target.closest('.carta');
  if (!carta) return;

  evento.preventDefault();
  lidarComClique({ target: carta });
}

export function iniciarViradaCartas() {
  const subcontainerCartas = document.querySelector('.subcontainer_cartas');
  if (!subcontainerCartas) return;

  subcontainerCartas.addEventListener('click', lidarComClique);
  subcontainerCartas.addEventListener('keydown', lidarComTeclado);
}