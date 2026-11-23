// DOM
const boneco = document.querySelector('#boneco');
const obstaculo = document.querySelector('#obstaculo');
const cenario = document.querySelector('#cenario');
const placar = document.querySelector('#placar');

let posicao = 50;
const velocidade = 6;
let jogoAtivo = true;

// Variáveis de Pontuação
let pontos = 0;
let recorde = Number(localStorage.getItem('dinoRecorde')) || 0;

// Formata o número com 5 dígitos (ex: 00015)
function formatarPontos(valor) {
    return String(Math.floor(valor)).padStart(5, '0');
}

// Atualiza o texto do placar na tela
function atualizarPlacar() {
    placar.textContent = `HI ${formatarPontos(recorde)} | ${formatarPontos(pontos)}`;
}

// Mostra o recorde salvo logo ao abrir a página
atualizarPlacar();

const teclas = {
    ArrowLeft: false,
    ArrowRight: false
};

// Detecta teclas pressionadas
document.addEventListener('keydown', (evento) => {
    if (!jogoAtivo) return;

    if (evento.key === 'ArrowUp' && !boneco.classList.contains('pulando')) {
        boneco.classList.add('pulando');
    }

    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
        teclas[evento.key] = true;
    }
});

// Detecta quando solta as teclas
document.addEventListener('keyup', (evento) => {
    if (evento.key === 'ArrowLeft' || evento.key === 'ArrowRight') {
        teclas[evento.key] = false;
    }
});

// Finaliza o pulo
boneco.addEventListener('animationend', () => {
    boneco.classList.remove('pulando');
});

// Verifica colisão entre dinossauro e pedra
function verificarColisao() {
    const rectBoneco = boneco.getBoundingClientRect();
    const rectObstaculo = obstaculo.getBoundingClientRect();
    const margem = 15;

    const bateu = (
        rectBoneco.right - margem > rectObstaculo.left + margem &&
        rectBoneco.left + margem < rectObstaculo.right - margem &&
        rectBoneco.bottom - margem > rectObstaculo.top + margem &&
        rectBoneco.top + margem < rectObstaculo.bottom - margem
    );

    if (bateu) {
        jogoAtivo = false;

        // Congela a pedra e o dinossauro no ponto exato da colisão
        const posicaoAtualPedra = obstaculo.offsetLeft;
        obstaculo.style.animation = 'none';
        obstaculo.style.left = posicaoAtualPedra + 'px';

        const posicaoAtualPulo = window.getComputedStyle(boneco).bottom;
        boneco.style.animation = 'none';
        boneco.style.bottom = posicaoAtualPulo;

        const pontuacaoFinal = Math.floor(pontos);

        // Salva o novo recorde se o jogador superou o anterior
        if (pontuacaoFinal > recorde) {
            recorde = pontuacaoFinal;
            localStorage.setItem('dinoRecorde', recorde);
            atualizarPlacar();
        }

        setTimeout(() => {
            alert(`Game Over!\nSua pontuação: ${pontuacaoFinal}\nRecorde: ${recorde}`);
            location.reload();
        }, 50);
    }
}

// Loop principal do jogo (60 FPS)
function atualizarJogo() {
    if (!jogoAtivo) return;

    const limiteDireito = cenario.offsetWidth - 70;

    if (teclas.ArrowLeft && posicao > 0) {
        posicao -= velocidade;
    }

    if (teclas.ArrowRight && posicao < limiteDireito) {
        posicao += velocidade;
    }

    boneco.style.left = posicao + 'px';

    
    pontos += 0.2;
    atualizarPlacar();

    verificarColisao();

    requestAnimationFrame(atualizarJogo);
}

setInterval(() => {
    if (jogoAtivo) {
        cenario.classList.toggle('noite');
    }
}, 10000);


atualizarJogo();