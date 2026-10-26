const multiplicadoresDificuldade = {
  facil: { inicial: 1.5, minimo: 1, intervalo: 12000, limite: 60000 },
  medio: { inicial: 2, minimo: 1.5, intervalo: 24000, limite: 120000 },
  dificil: { inicial: 2.25, minimo: 1.75, intervalo: 36000, limite: 180000 },
  edificil: { inicial: 3, minimo: 2, intervalo: 24000, limite: 240000 }
};

let dificuldadeAtual = 'facil';
let respostasCorretas = 0;
let tempoAtual = 0;

function obterConfiguracaoAtual() {
  return multiplicadoresDificuldade[dificuldadeAtual];
}

export function obterMultiplicadorStreak() {
  const configuracao = obterConfiguracaoAtual();
  const tempoConsiderado = Math.min(tempoAtual, configuracao.limite);
  const reducoes = Math.floor(tempoConsiderado / configuracao.intervalo);
  const decaimento = reducoes * 0.1;
  const valorTemporal = Math.max(
    configuracao.minimo,
    configuracao.inicial - decaimento
  );
  const bonusQuiz = respostasCorretas * 0.1;
  return valorTemporal + bonusQuiz;
}

function atualizarTela() {
  const valor = document.querySelector('#streak-valor');
  const respostas = document.querySelector('#streak-respostas');

  if (valor) valor.textContent = `${obterMultiplicadorStreak().toFixed(2)}x`;
  if (respostas) respostas.textContent = String(respostasCorretas);
}

export function iniciarStreak() {
  document.addEventListener('memory:timer-tick', (evento) => {
    tempoAtual = Math.max(0, evento.detail.tempo);
    atualizarTela();
  });

  document.addEventListener('quiz:answer-result', (evento) => {
    if (evento.detail.correta) {
      respostasCorretas += 1;
      atualizarTela();
    }
  });

  document.addEventListener('streak:difficulty-changed', (evento) => {
    if (!multiplicadoresDificuldade[evento.detail.dificuldade]) return;

    dificuldadeAtual = evento.detail.dificuldade;
    respostasCorretas = 0;
    atualizarTela();
  });

  atualizarTela();
}

export function reiniciarStreak() {
  respostasCorretas = 0;
  tempoAtual = 0;
  atualizarTela();
}