const categoriaPorIcone = {
  internet: 'internet',
  infrastructure: 'infraestrutura',
  school: 'escola',
  financy: 'finanças / economia',
  old: 'idosos',
  accessibility: 'acessibilidade e inclusão',
  work: 'trabalho e mercado de trabalho',
  health: 'saúde digital',
  citizenship: 'cidadania e serviços públicos',
  security: 'segurança e privacidade digital',
  region: 'desigualdade social e regional',
  financial_education: 'educação financeira digital',
  comunity: 'tecnologia e comunidade'
};

let perguntas = {};
let perguntaAtual = null;
let alternativaSelecionada = null;
let quizCarregado = false;
let respostaConfirmada = false;
let perguntaConcluiJogo = false;
let atualizadorTempo = null;

function atualizarBotaoConfirmar() {
  const botao = document.querySelector('#quiz-confirmar');
  if (botao) botao.disabled = alternativaSelecionada === null;
}

function limparAlternativas() {
  const container = document.querySelector('#quiz-alternativas');
  if (container) container.replaceChildren();
}

function mostrarPergunta(nome) {
  const categoria = categoriaPorIcone[nome];
  const perguntasCategoria = perguntas[categoria];
  if (!perguntasCategoria || perguntasCategoria.length === 0) {
    console.error(`Nenhuma pergunta cadastrada para o ícone "${nome}".`);
    return;
  }

  perguntaAtual =
    perguntasCategoria[Math.floor(Math.random() * perguntasCategoria.length)];
  alternativaSelecionada = null;
  respostaConfirmada = false;

  document.querySelector('#quiz-categoria').textContent = categoria;
  document.querySelector('#quiz-pergunta').textContent = perguntaAtual.pergunta;
  document.querySelector('#quiz-tempo').textContent =
    document.querySelector('#tempo').textContent;
  window.clearInterval(atualizadorTempo);
  atualizadorTempo = window.setInterval(() => {
    const tempo = document.querySelector('#tempo');
    const tempoQuiz = document.querySelector('#quiz-tempo');
    if (tempo && tempoQuiz) tempoQuiz.textContent = tempo.textContent;
  }, 10);
  limparAlternativas();

  perguntaAtual.alternativa.forEach((texto, indice) => {
    const alternativa = document.createElement('button');
    alternativa.className = 'quiz_alternativa';
    alternativa.type = 'button';
    alternativa.textContent = texto;
    alternativa.dataset.indice = String(indice);
    alternativa.addEventListener('click', () => {
      document.querySelectorAll('.quiz_alternativa').forEach((item) => {
        item.classList.remove('selecionada');
      });
      alternativa.classList.add('selecionada');
      alternativaSelecionada = indice;
      atualizarBotaoConfirmar();
    });
    document.querySelector('#quiz-alternativas').appendChild(alternativa);
  });

  const botao = document.querySelector('#quiz-confirmar');
  botao.textContent = 'Selecionar alternativa';
  botao.disabled = true;
  botao.onclick = null;
  document.querySelector('#quiz-modal').hidden = false;
}

function confirmarResposta() {
  if (!perguntaAtual || alternativaSelecionada === null) return;
  if (respostaConfirmada) {
    window.clearInterval(atualizadorTempo);
    atualizadorTempo = null;
    document.querySelector('#quiz-modal').hidden = true;
    document.dispatchEvent(
      new CustomEvent('quiz:finished', {
        detail: { concluido: perguntaConcluiJogo }
      })
    );
    perguntaAtual = null;
    alternativaSelecionada = null;
    perguntaConcluiJogo = false;
    return;
  }

  const correta = Number(perguntaAtual['resposta correta']);
  respostaConfirmada = true;
  const alternativas = document.querySelectorAll('.quiz_alternativa');
  alternativas.forEach((alternativa, indice) => {
    alternativa.disabled = true;
    alternativa.classList.remove('selecionada');
    alternativa.classList.add(indice === correta ? 'correta' : 'errada');
  });

  document.dispatchEvent(
    new CustomEvent('quiz:answer-result', {
      detail: { correta: alternativaSelecionada === correta }
    })
  );

  const botao = document.querySelector('#quiz-confirmar');
  botao.textContent = 'Continuar';
  botao.disabled = false;
}

export async function iniciarQuiz() {
  try {
    const resposta = await fetch('./src/data/info.json');
    if (!resposta.ok) {
      throw new Error(`Falha ao carregar perguntas: ${resposta.status}`);
    }
    const dados = await resposta.json();
    perguntas = dados['perguntas quiz'] || {};
    quizCarregado = true;
  } catch (erro) {
    console.error('Não foi possível carregar as perguntas do quiz.', erro);
  }

  document.querySelector('#quiz-confirmar')?.addEventListener(
    'click',
    confirmarResposta
  );
  document.addEventListener('memory:pair-result', (evento) => {
    if (evento.detail.correto && quizCarregado) {
      perguntaConcluiJogo = evento.detail.concluido;
      mostrarPergunta(evento.detail.nome);
    }
  });
}

export function reiniciarQuiz() {
  window.clearInterval(atualizadorTempo);
  atualizadorTempo = null;
  document.querySelector('#quiz-modal').hidden = true;
  perguntaAtual = null;
  alternativaSelecionada = null;
  respostaConfirmada = false;
  perguntaConcluiJogo = false;
}