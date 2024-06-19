document.addEventListener("DOMContentLoaded", () => {
  let nostalgistInstance;

  const gameForm = document.getElementById("gameForm");
  const gameFileInput = document.getElementById("gameFile");

  const saveStateBtn = document.getElementById("saveStateBtn");
  const loadStateBtn = document.getElementById("loadStateBtn");

  gameForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const file = gameFileInput.files[0];
    console.log(file);
    if (file) {
      try {
        // Carregar jogo
        nostalgistInstance = await Nostalgist.nes(file);
        console.log("Jogo carregado com sucesso:", file.name);
      } catch (error) {
        console.error("Erro ao carregar o jogo:", error);
      }
    } else {
      console.error("Nenhum ficheiro selecionado.");
    }
  });

  saveStateBtn.addEventListener("click", () => {
    if (nostalgistInstance) {
      try {
        const savedState = nostalgistInstance.saveState();
        console.log("Estado do jogo salvo:", savedState);

        // Enviar o estado do jogo para o servidor como JSON
        fetch("/saveState", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: savedState,
        })
          .then((response) => {
            if (!response.ok) {
              throw new Error("Erro ao salvar estado do jogo");
            }
            return response.text();
          })
          .then((data) => {
            console.log(data);
          })
          .catch((error) => {
            console.error("Erro ao salvar estado do jogo:", error);
          });
      } catch (error) {
        console.error("Erro ao salvar estado do jogo:", error);
      }
    } else {
      console.error("Nenhum jogo carregado para salvar o estado.");
    }
  });

  loadStateBtn.addEventListener("click", () => {
    function retrieveSavedState() {
      return {
        // Vazio por enquanto
      };
    }

    if (nostalgistInstance) {
      try {
        const savedState = retrieveSavedState();
        nostalgistInstance.loadState(savedState);
        console.log("Estado do jogo carregado.");
      } catch (error) {
        console.error("Erro ao carregar estado do jogo:", error);
      }
    } else {
      console.error("Nenhum jogo carregado para carregar o estado.");
    }
  });
});
