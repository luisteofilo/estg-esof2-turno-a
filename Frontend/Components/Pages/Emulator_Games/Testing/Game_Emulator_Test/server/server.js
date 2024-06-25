const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json()); // Middleware para tratar o JSON
app.use(express.static(path.join(__dirname, "public")));

app.post("/saveState", (req, res) => {
  const gameState = req.body; // Recebe o objeto enviado pelo cliente (a partir do body)

  // Salva o estado do jogo no ficheiro desejado
  const savePath = path.join(__dirname, "data", "save.json");
  fs.writeFile(savePath, JSON.stringify(gameState, null, 2), (err) => {
    if (err) {
      console.error("Erro ao salvar estado do jogo:", err);
      return res.status(500).send("Erro ao salvar estado do jogo.");
    }
    console.log("Estado do jogo salvo com sucesso:", savePath);
    res.send("Estado do jogo salvo com sucesso.");
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
