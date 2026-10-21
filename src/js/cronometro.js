let segundos = 0;
let intervalo = null;
let cronometrando = false;

export function iniciarCronometro() {
    if (cronometrando) return; // Evita criar múltiplos intervalos
    cronometrando = true;

    intervalo = setInterval(() => {
        segundos++;
        atualizarDisplayTempo();
    }, 1000);
}

export function pausarCronometro() {
    clearInterval(intervalo);
    cronometrando = false;
}

export function reiniciarCronometro() {
    pausarCronometro();
    segundos = 0;
    atualizarDisplayTempo();
}

function atualizarDisplayTempo() {
    const spanTempo = document.getElementById('tempo');
    if (!spanTempo) return;

    const minutos = Math.floor(segundos / 60);
    const segsRestantes = segundos % 60;

    const minFormatado = String(minutos).padStart(2, '0');
    const segFormatado = String(segsRestantes).padStart(2, '0');

    spanTempo.textContent = `${minFormatado}:${segFormatado}`;
}

export function isCronometrando() {
    return cronometrando;
}