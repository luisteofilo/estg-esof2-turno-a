var EJS_player = '#game-container'; // Seleciona o container do jogo
var EJS_gameUrl = 'https://www.emulatorjs.com/roms/mega_mountain.nes'; // URL do ROM do jogo
var EJS_core = 'nes'; // Núcleo do emulador (opcional)

// Redimensionar o contêiner do emulador
function resizeEmulatorContainer() {
    var container = document.querySelector(EJS_player);
    var width = window.innerWidth * 0.5; // Definir largura como 80% da largura da janela
    var height = width * (9 / 16); // Proporção 16:9 (ajustável conforme necessário)
    container.style.width = width + 'px';
    container.style.height = height + 'px';
}

// Inicializar o emulador com redimensionamento do contêiner
async function initializeEmulatorJs() {
    await new Promise((resolve, reject) => {
        // Redimensionar o contêiner antes de carregar o jogo
        resizeEmulatorContainer();

        // Carregar o jogo no emulador
        EJSLoader.load(EJS_gameUrl, EJS_core, resolve);
    });
}

// Carregar o emulador
async function loadEmulatorJs() {
    // Redimensionar o contêiner antes de carregar o emulador.js
    resizeEmulatorContainer();

    // Carregar Emulator.js
    await new Promise((resolve, reject) => {
        var script = document.createElement('script');
        script.src = 'https://www.emulatorjs.com/loader.js';
        script.onload = resolve;
        script.onerror = reject;
        document.body.appendChild(script);
    });

    // Inicializar o emulador após carregar
    await initializeEmulatorJs();
}

// Chamar a função para carregar o emulador ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    loadEmulatorJs(); // Carrega o emulador
    window.addEventListener('resize', resizeEmulatorContainer); // Chama ao redimensionar a janela
});