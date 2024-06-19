//import Nostalgist from "nostalgist";

// Aguarde o carregamento completo do DOM antes de manipular os elementos
document.addEventListener("DOMContentLoaded", () => {
    // Referencie o formulário e o input de arquivo
    const gameForm = document.getElementById("gameForm");
    const gameFileInput = document.getElementById("gameFile");

    // Adicione um ouvinte para o evento submit do formulário
    gameForm.addEventListener("submit", async (event) => {
        event.preventDefault(); // Previne o envio padrão do formulário

        const file = gameFileInput.files[0]; // Obtém o arquivo selecionado pelo usuário
        console.log(file);
        if (file) {
            try {
                // Carrega o jogo selecionado para o emulador
                const nostalgist = await Nostalgist.nes(file);
                console.log("Jogo carregado com sucesso:", file.name);
            } catch (error) {
                console.error("Erro ao carregar o jogo:", error);
            }
        } else {
            console.error("Nenhum arquivo selecionado.");
        }
    });
});
