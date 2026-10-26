export let quantidadePares = 6;

const listaIcones = [
  { nome: 'financy', img: './src/image/icons/financy.png' },
  { nome: 'infrastructure', img: './src/image/icons/infrastructure.png' },
  { nome: 'internet', img: './src/image/icons/internet.png' },
  { nome: 'old', img: './src/image/icons/old.png' },
  { nome: 'school', img: './src/image/icons/school.png' },
  { nome: 'accessibility', img: './src/image/icons/accessibility.png' },
  { nome: 'citizenship', img: './src/image/icons/citizenship.png' },
  { nome: 'community', img: './src/image/icons/community.png' },
  { nome: 'financial_education', img: './src/image/icons/financial_education.png' },
  { nome: 'health', img: './src/image/icons/health.png' },
  { nome: 'region', img: './src/image/icons/region.png' },
  { nome: 'security', img: './src/image/icons/security.png' },
  { nome: 'work', img: './src/image/icons/work.png' }
];

function definirTamanhoCartas(subcontainerCartas, totalCartas, colunas) {
  const containerCartas = subcontainerCartas.parentElement;
  if (!containerCartas) return;

  const linhas = Math.ceil(totalCartas / colunas);
  const gap = 4;
  const estilosContainer = getComputedStyle(containerCartas);
  const paddingHorizontal =
    parseFloat(estilosContainer.paddingLeft) +
    parseFloat(estilosContainer.paddingRight);
  const paddingVertical =
    parseFloat(estilosContainer.paddingTop) +
    parseFloat(estilosContainer.paddingBottom);
  const larguraDisponivel = Math.max(
    0,
    containerCartas.clientWidth - paddingHorizontal
  );
  const alturaDisponivel = Math.max(
    0,
    containerCartas.clientHeight - paddingVertical
  );

  const larguraPorColuna = (larguraDisponivel - gap * (colunas - 1)) / colunas;
  const alturaPorLinha = (alturaDisponivel - gap * (linhas - 1)) / linhas;
  const larguraPorAltura = alturaPorLinha / 1.5;
  const larguraCarta = Math.max(
    1,
    Math.min(120, larguraPorColuna, larguraPorAltura)
  );

  subcontainerCartas.style.setProperty('--largura-carta', `${larguraCarta}px`);
  subcontainerCartas.style.gridTemplateColumns =
    `repeat(${colunas}, var(--largura-carta))`;
}

function escolherColunas(totalCartas, containerCartas) {
  const estilosContainer = getComputedStyle(containerCartas);
  const paddingHorizontal =
    parseFloat(estilosContainer.paddingLeft) +
    parseFloat(estilosContainer.paddingRight);
  const paddingVertical =
    parseFloat(estilosContainer.paddingTop) +
    parseFloat(estilosContainer.paddingBottom);
  const larguraDisponivel = Math.max(
    0,
    containerCartas.clientWidth - paddingHorizontal
  );
  const alturaDisponivel = Math.max(
    0,
    containerCartas.clientHeight - paddingVertical
  );
  let melhorColunas = 1;
  let maiorCarta = 0;

  for (let colunas = 1; colunas <= totalCartas; colunas++) {
    const linhas = Math.ceil(totalCartas / colunas);
    const larguraPorColuna =
      (larguraDisponivel - 4 * (colunas - 1)) / colunas;
    const alturaPorLinha = (alturaDisponivel - 4 * (linhas - 1)) / linhas;
    const tamanhoCarta = Math.min(120, larguraPorColuna, alturaPorLinha / 1.5);

    if (tamanhoCarta > maiorCarta) {
      maiorCarta = tamanhoCarta;
      melhorColunas = colunas;
    }
  }

  return melhorColunas;
}

export function gerarCartas() {
  const subcontainerCartas = document.querySelector('.subcontainer_cartas');
  if (!subcontainerCartas) return;

  subcontainerCartas.innerHTML = '';

  // Preenche os ícones
  const iconesSelecionados = [];
  for (let i = 0; i < quantidadePares; i++) {
    iconesSelecionados.push(listaIcones[i % listaIcones.length]);
  }

  const paresCartas = [...iconesSelecionados, ...iconesSelecionados];
  const totalCartas = paresCartas.length;
  const colunas = escolherColunas(totalCartas, subcontainerCartas.parentElement);

  // Aplica a quantidade de colunas diretamente no container via JavaScript
  subcontainerCartas.style.gridTemplateColumns = `repeat(${colunas}, 1fr)`;

  // Embaralha as cartas
  const cartasEmbaralhadas = [...paresCartas].sort(() => Math.random() - 0.5);

  // Renderiza no HTML
  cartasEmbaralhadas.forEach(item => {
    const cartaDiv = document.createElement('div');
    cartaDiv.classList.add('carta');
    cartaDiv.dataset.nome = item.nome;
    cartaDiv.tabIndex = 0;
    cartaDiv.setAttribute('role', 'button');
    cartaDiv.setAttribute('aria-label', 'Carta escondida');

    const cartaInterna = document.createElement('div');
    cartaInterna.classList.add('carta__interna');

    const verso = document.createElement('div');
    verso.classList.add('carta__face', 'carta__verso');
    verso.setAttribute('aria-hidden', 'false');

    const frente = document.createElement('div');
    frente.classList.add('carta__face', 'carta__frente');
    
    const img = document.createElement('img');
    img.src = item.img;
    img.alt = item.nome;

    frente.appendChild(img);
    cartaInterna.append(verso, frente);
    cartaDiv.appendChild(cartaInterna);
    subcontainerCartas.appendChild(cartaDiv);
  });

  definirTamanhoCartas(subcontainerCartas, totalCartas, colunas);
}

export function definirQuantidadePares(novaQuantidade) {
  quantidadePares = novaQuantidade;
}

window.addEventListener('resize', () => {
  const subcontainerCartas = document.querySelector('.subcontainer_cartas');
  if (!subcontainerCartas) return;

  const totalCartas = subcontainerCartas.children.length;
  const colunas = subcontainerCartas.style.gridTemplateColumns
    .match(/\d+/)?.[0];

  if (colunas) {
    definirTamanhoCartas(subcontainerCartas, totalCartas, Number(colunas));
  }
});