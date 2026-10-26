import { obterTempoAtual } from './cronometro.js';
import { obterEstatisticasAtuais } from './contabilizar_pontos.js';
import { obterUsuarioAtual } from './login.js';
import { obterDificuldadeAtual } from './dificuldade.js';

const CHAVE_PLACAR = 'jogo-memoria-placar';
const nivelPorDificuldade = {
  facil: 1,
  medio: 2,
  dificil: 3,
  edificil: 4
};
let filtroAtual = 'pontos';
let partidaPendente = null;

function carregarPartidas() {
  try {
    const partidas = JSON.parse(localStorage.getItem(CHAVE_PLACAR) || '[]');
    return Array.isArray(partidas) ? partidas : [];
  } catch (erro) {
    console.error('Não foi possível carregar o placar.', erro);
    return [];
  }
}

function salvarPartidas(partidas) {
  try {
    localStorage.setItem(CHAVE_PLACAR, JSON.stringify(partidas));
  } catch (erro) {
    console.error('Não foi possível salvar o placar.', erro);
  }
}

function ordenarPartidas(partidas) {
  return [...partidas].sort((a, b) => {
    if (filtroAtual === 'pontos') return b.pontos - a.pontos;
    if (filtroAtual === 'tentativas') return a.tentativas - b.tentativas;
    if (filtroAtual === 'recente') return b.adicionado - a.adicionado;
    if (filtroAtual === 'antigo') return a.adicionado - b.adicionado;
    return b.pontos - a.pontos;
  });
}

function formatarTempo(tempo) {
  const milissegundos = Math.floor(tempo);
  const minutos = Math.floor(milissegundos / 60000);
  const segundos = Math.floor((milissegundos % 60000) / 1000);
  const restante = milissegundos % 1000;
  return `${String(minutos).padStart(2, '0')}:${String(segundos).padStart(2, '0')}:${String(restante).padStart(3, '0')}`;
}

function obterNivel(partida) {
  if (Number.isInteger(partida.nivelDificuldade)) {
    return Math.max(1, Math.min(4, partida.nivelDificuldade));
  }
  return 1;
}

function filtrarPartidas(partidas) {
  const prefixo = 'dificuldade-';
  if (!filtroAtual.startsWith(prefixo)) return partidas;

  const nivelSelecionado = Number(filtroAtual.slice(prefixo.length));
  return partidas.filter((partida) => obterNivel(partida) === nivelSelecionado);
}

function renderizar() {
  const lista = document.querySelector('#placar-lista');
  const vazio = document.querySelector('#placar-vazio');
  if (!lista || !vazio) return;

  lista.innerHTML = '';
  const partidas = ordenarPartidas(filtrarPartidas(carregarPartidas()));
  vazio.hidden = partidas.length > 0;

  partidas.forEach((partida, indice) => {
    const linha = document.createElement('tr');
    [indice + 1, null, partida.pontos, formatarTempo(partida.tempo), partida.tentativas]
      .forEach((valor, coluna) => {
        const celula = document.createElement('td');
        if (coluna === 1) {
          const nivel = obterNivel(partida);
          const caveiras = document.createElement('span');
          caveiras.className = 'placar_dificuldade';
          caveiras.setAttribute(
            'aria-label',
            `Nível de dificuldade ${nivel} de 4`
          );
          for (let indiceCaveira = 0; indiceCaveira < nivel; indiceCaveira += 1) {
            const caveira = document.createElement('img');
            caveira.src = './src/image/icons/skull.png';
            caveira.alt = '';
            caveira.setAttribute('aria-hidden', 'true');
            caveiras.appendChild(caveira);
          }
          caveiras.appendChild(document.createTextNode(' '));
          celula.append(caveiras, document.createTextNode(partida.nome));
        } else {
          celula.textContent = String(valor);
        }
        linha.appendChild(celula);
      });
    lista.appendChild(linha);
  });
}

export function obterPartidaPendente() {
  return partidaPendente;
}

export function registrarPartida(usuario) {
  if (!usuario) return false;
  const estatisticas = partidaPendente || {
    ...obterEstatisticasAtuais(),
    tempo: obterTempoAtual()
  };
  const partidas = carregarPartidas();
  const partida = {
    nome: usuario.nome,
    usuario: usuario.nome.toLowerCase(),
    pontos: estatisticas.pontos,
    tentativas: estatisticas.tentativas,
    tempo: estatisticas.tempo,
    nivelDificuldade:
      estatisticas.nivelDificuldade ||
      nivelPorDificuldade[obterDificuldadeAtual()],
    adicionado: Date.now()
  };
  const indice = partidas.findIndex((item) => item.usuario === partida.usuario);
  if (indice >= 0) partidas[indice] = partida;
  else partidas.push(partida);
  salvarPartidas(partidas);
  partidaPendente = null;
  renderizar();
  return true;
}

function configurarModal() {
  const modal = document.querySelector('#placar-modal');
  const abrir = document.querySelector('#abrir-placar');
  const fechar = document.querySelector('#fechar-placar');
  const filtro = document.querySelector('#abrir-filtros');
  const opcoes = document.querySelector('#opcoes-filtro');
  const salvar = document.querySelector('#salvar-placar');
  if (!modal || !abrir || !fechar || !filtro || !opcoes || !salvar) return;

  abrir.addEventListener('click', () => {
    renderizar();
    modal.hidden = false;
  });
  fechar.addEventListener('click', () => {
    modal.hidden = true;
    opcoes.hidden = true;
    filtro.setAttribute('aria-expanded', 'false');
  });
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) fechar.click();
  });
  filtro.addEventListener('click', () => {
    opcoes.hidden = !opcoes.hidden;
    filtro.setAttribute('aria-expanded', String(!opcoes.hidden));
  });
  opcoes.addEventListener('click', (evento) => {
    const opcao = evento.target.closest('[data-filtro]');
    if (!opcao) return;
    filtroAtual = opcao.dataset.filtro;
    renderizar();
  });

  salvar.addEventListener('click', () => {
    document.dispatchEvent(new CustomEvent('placar:save-request'));
  });
}

export function iniciarPlacar() {
  configurarModal();
  document.addEventListener('memory:pair-result', (evento) => {
    if (evento.detail.concluido) {
      partidaPendente = {
        pontos: obterEstatisticasAtuais().pontos,
        tentativas: obterEstatisticasAtuais().tentativas,
        tempo: obterTempoAtual(),
        nivelDificuldade: nivelPorDificuldade[obterDificuldadeAtual()]
      };
    }
  });
  document.addEventListener('placar:save', () => {
    const usuario = obterUsuarioAtual();
    if (usuario) registrarPartida(usuario);
  });
}