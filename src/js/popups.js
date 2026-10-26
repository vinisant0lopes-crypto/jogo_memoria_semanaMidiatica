import { obterUsuarioAtual, registrarUsuario } from './login.js';
import { obterPartidaPendente, registrarPartida } from './placar.js';

export function iniciarPopups() {
  const modal = document.querySelector('#salvar-modal');
  const fechar = document.querySelector('#fechar-salvar');
  const form = document.querySelector('#form-salvar');
  const titulo = document.querySelector('#salvar-titulo');
  const instrucoes = document.querySelector('#salvar-instrucoes');
  const nomeCampo = document.querySelector('#salvar-nome-campo');
  const nome = document.querySelector('#salvar-nome');
  const senha = document.querySelector('#salvar-senha');
  const confirmar = document.querySelector('#confirmar-salvar');
  const mensagem = document.querySelector('#salvar-mensagem');
  if (!modal || !fechar || !form || !titulo || !instrucoes || !nomeCampo ||
      !nome || !senha || !confirmar || !mensagem) return;

  document.addEventListener('placar:save-request', () => {
    if (!obterPartidaPendente()) {
      titulo.textContent = 'Salvar dados do placar';
      instrucoes.textContent = 'Finalize uma partida antes de salvar o resultado.';
      form.hidden = true;
      modal.hidden = false;
      return;
    }
    const usuario = obterUsuarioAtual();
    form.reset();
    form.hidden = false;
    mensagem.textContent = '';
    if (usuario) {
      titulo.textContent = 'Substituir dados';
      instrucoes.textContent = 'Para substituir seus dados no placar, insira sua senha novamente.';
      nomeCampo.hidden = true;
      confirmar.textContent = 'Substituir';
    } else {
      titulo.textContent = 'Registrar para salvar';
      instrucoes.textContent = 'Você não está registrado. Cadastre-se para poder salvar no placar.';
      nomeCampo.hidden = false;
      confirmar.textContent = 'Registrar e salvar';
    }
    modal.hidden = false;
    senha.focus();
  });
  fechar.addEventListener('click', () => { modal.hidden = true; });
  modal.addEventListener('click', (evento) => {
    if (evento.target === modal) modal.hidden = true;
  });
  form.addEventListener('submit', (evento) => {
    evento.preventDefault();
    const usuario = obterUsuarioAtual();
    const dados = new FormData(form);
    const senhaInformada = String(dados.get('senha') || '');
    if (!usuario) {
      const nomeInformado = String(dados.get('nome') || '').trim();
      const novoUsuario = registrarUsuario(nomeInformado, senhaInformada);
      if (!novoUsuario) {
        mensagem.textContent = 'Este nome já está registrado ou a senha é muito curta.';
        return;
      }
      registrarPartida(novoUsuario);
      mensagem.textContent = 'Registro realizado e dados salvos no placar.';
      window.setTimeout(() => { modal.hidden = true; }, 500);
      return;
    }
    if (usuario.senha !== senhaInformada) {
      mensagem.textContent = 'Senha incorreta. Seus dados não foram substituídos.';
      return;
    }
    registrarPartida(usuario);
    mensagem.textContent = 'Dados substituídos no placar.';
    window.setTimeout(() => { modal.hidden = true; }, 500);
  });
}