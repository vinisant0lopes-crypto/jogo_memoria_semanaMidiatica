const CHAVE_USUARIOS = 'jogo-memoria-usuarios';
const CHAVE_SESSAO = 'jogo-memoria-sessao';
let usuarioAtual = null;

function carregarUsuarios() {
  try {
    const usuarios = JSON.parse(localStorage.getItem(CHAVE_USUARIOS) || '[]');
    return Array.isArray(usuarios) ? usuarios : [];
  } catch (erro) {
    console.error('Não foi possível carregar as contas.', erro);
    return [];
  }
}

function nomeNormalizado(nome) {
  return nome.trim().toLowerCase();
}

export function obterUsuarioAtual() {
  return usuarioAtual;
}

export function registrarUsuario(nome, senha) {
  const nomeFormatado = nomeNormalizado(nome);
  const usuarios = carregarUsuarios();
  if (!nomeFormatado || senha.length < 4 || usuarios.some((item) => item.nome === nomeFormatado)) {
    return null;
  }
  const usuario = { nome: nomeFormatado, senha };
  usuarios.push(usuario);
  localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));
  usuarioAtual = usuario;
  localStorage.setItem(CHAVE_SESSAO, usuario.nome);
  atualizarStatus();
  return usuario;
}

let atualizarStatus = () => {};

export function iniciarLogin() {
  const modal = document.querySelector('#login-modal');
  const abrir = document.querySelector('#abrir-login');
  const fechar = document.querySelector('#fechar-login');
  const status = document.querySelector('#login-status');
  const mensagem = document.querySelector('#login-mensagem');
  const formLogin = document.querySelector('#form-login');
  const formRegistro = document.querySelector('#form-registro');
  const abaLogin = document.querySelector('#aba-login');
  const abaRegistro = document.querySelector('#aba-registro');
  const sair = document.querySelector('#sair-login');
  if (!modal || !abrir || !fechar || !status || !mensagem || !formLogin ||
      !formRegistro || !abaLogin || !abaRegistro || !sair) return;

  atualizarStatus = () => {
    const conectado = Boolean(usuarioAtual);
    status.textContent = conectado ? `Usuário conectado: Sim (${usuarioAtual.nome})` : 'Usuário conectado: Não';
    formLogin.hidden = conectado;
    formRegistro.hidden = true;
    abaLogin.hidden = conectado;
    abaRegistro.hidden = conectado;
    sair.hidden = !conectado;
    abrir.textContent = conectado ? 'Sair / Conectado' : 'Sair / Conectar';
  };
  const trocarAba = (registro) => {
    formLogin.hidden = registro;
    formRegistro.hidden = !registro;
    abaLogin.setAttribute('aria-selected', String(!registro));
    abaRegistro.setAttribute('aria-selected', String(registro));
    mensagem.textContent = '';
  };

  const nomeSessao = localStorage.getItem(CHAVE_SESSAO);
  usuarioAtual = carregarUsuarios().find((usuario) => usuario.nome === nomeSessao) || null;
  atualizarStatus();
  abrir.addEventListener('click', () => { atualizarStatus(); modal.hidden = false; });
  fechar.addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.hidden = true;
  });
  abaLogin.addEventListener('click', () => trocarAba(false));
  abaRegistro.addEventListener('click', () => trocarAba(true));
  formLogin.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const dados = new FormData(formLogin);
    const nome = nomeNormalizado(String(dados.get('nome') || ''));
    const senha = String(dados.get('senha') || '');
    const usuario = carregarUsuarios().find((item) => item.nome === nome && item.senha === senha);
    if (!usuario) {
      mensagem.textContent = 'Nome ou senha inválidos.';
      return;
    }
    usuarioAtual = usuario;
    localStorage.setItem(CHAVE_SESSAO, usuario.nome);
    mensagem.textContent = 'Login realizado.';
    atualizarStatus();
  });
  formRegistro.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const dados = new FormData(formRegistro);
    const usuario = registrarUsuario(String(dados.get('nome') || ''), String(dados.get('senha') || ''));
    mensagem.textContent = usuario ? 'Registro realizado.' : 'Nome já usado ou senha muito curta.';
  });
  sair.addEventListener('click', () => {
    usuarioAtual = null;
    localStorage.removeItem(CHAVE_SESSAO);
    mensagem.textContent = 'Você saiu da conta.';
    atualizarStatus();
  });
}