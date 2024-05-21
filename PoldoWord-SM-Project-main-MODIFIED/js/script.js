const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game");
const scoreElement = document.getElementById("score");
const rankingContainer = document.getElementById("ranking");

let score = 0; // Inicializa o contador de pontos
let passedPipe = false; // Variável para controlar se o Mario já passou pelo pipe atual
let currentPlayer = ""; // Variável para armazenar o nome do jogador atual

// Carregar os dados dos jogadores do armazenamento local ou inicializar uma lista vazia
let players = JSON.parse(localStorage.getItem("players")) || [];

const jump = () => {
  mario.classList.add("jump");
  setTimeout(() => {
    mario.classList.remove("jump");
  }, 500);
};

const updateScore = () => {
  scoreElement.textContent = `Score: ${score}`;
};

const checkCollisions = () => {
  const pipePosition = pipe.offsetLeft;
  const marioPosition = +window
    .getComputedStyle(mario)
    .bottom.replace("px", "");

  // Verificar se o Mario colidiu com o cano
  if (pipePosition <= 70 && pipePosition > 0 && marioPosition < 100) {
    gameOver();
  } else if (pipePosition < 0 && !passedPipe) {
    score++;
    updateScore();
    passedPipe = true;
    setTimeout(() => {
      passedPipe = false;
    }, 2000);
  }
};

const confirmNameAndStartGame = () => {
  const playerNameInput = document.getElementById("playerName");
  currentPlayer = playerNameInput.value.trim();
  if (!currentPlayer) {
    alert("Por favor, insira seu nome para começar o jogo!");
    return;
  }
  startGame();
};

const startGame = () => {
  menu.style.display = "none";
  gameContainer.style.display = "block";
  document.addEventListener("keydown", jump);
  updateScore();
};

const gameOver = () => {
  pipe.style.animation = "none";
  pipe.style.left = `${pipe.offsetLeft}px`;

  mario.style.animation = "none";
  mario.style.bottom = `${+window
    .getComputedStyle(mario)
    .bottom.replace("px", "")}px`;

  mario.src = "./images/game-over.png";
  mario.style.width = "75px";
  mario.style.marginLeft = "40px";

  if (currentPlayer) {
    players.push({ name: currentPlayer, score });
    localStorage.setItem("players", JSON.stringify(players));
    showRanking();
  }

  clearInterval(loop);
};

const showRanking = () => {
  let rankingHTML = "<h2>Ranking</h2>";
  rankingHTML += "<ol>";
  players
    .sort((a, b) => b.score - a.score)
    .forEach((player, index) => {
      rankingHTML += `<li>${player.name}: ${player.score}</li>`;
      if (index >= 4) return; 
    });
  rankingHTML += "</ol>";
  rankingContainer.innerHTML = rankingHTML;
};

window.onload = showRanking;

const loop = setInterval(checkCollisions, 10);
document.addEventListener("keydown", jump);

const clearLocalStorage = () => {
  localStorage.removeItem("players");
  players = [];
  showRanking(); // Atualizar o ranking para refletir as alterações
};
