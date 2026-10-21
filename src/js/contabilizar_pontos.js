let tentativasTotal = 0;
let pontosTotal = 0;

export function incrementarTentativas() {
    tentativasTotal++;
    atualizarDisplayTentativas();
}

export function incrementarPontos(quantidade = 10) {
    pontosTotal += quantidade;
    atualizarDisplayPontos();
}

export function reiniciarPontuacao() {
    tentativasTotal = 0;
    pontosTotal = 0;
    atualizarDisplayTentativas();
    atualizarDisplayPontos();
}

function atualizarDisplayTentativas() {
    const spanTentativas = document.getElementById('tentativas');
    if (spanTentativas) {
        spanTentativas.textContent = tentativasTotal;
    }
}

function atualizarDisplayPontos() {
    const spanPontos = document.getElementById('pontos');
    if (spanPontos) {
        spanPontos.textContent = pontosTotal;
    }
}

export function getTentativas() {
    return tentativasTotal;
}

export function getPontos() {
    return pontosTotal;
}