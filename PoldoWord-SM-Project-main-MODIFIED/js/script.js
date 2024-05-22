const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game");
const scoreElement = document.getElementById("score");
const rankingContainer = document.getElementById("ranking");
const gameOverScreen = document.getElementById("game-over");

let score = 0;
let passedPipe = false;
let currentPlayer = "";
let players = JSON.parse(localStorage.getItem("players")) || [];
let gameInterval;

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
  const marioPosition = +window.getComputedStyle(mario).bottom.replace("px", "");

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
  gameOverScreen.style.display = "none";
  document.addEventListener("keydown", jump);
  score = 0;
  updateScore();
  gameInterval = setInterval(checkCollisions, 10);
};

const gameOver = () => {
  clearInterval(gameInterval);
  pipe.style.animation = "none";
  pipe.style.left = `${pipe.offsetLeft}px`;

  mario.style.animation = "none";
  mario.style.bottom = `${+window.getComputedStyle(mario).bottom.replace("px", "")}px`;

  mario.src = "./images/game-over.png";
  mario.style.width = "75px";
  mario.style.marginLeft = "40px";

  if (currentPlayer) {
    players.push({ name: currentPlayer, score });
    localStorage.setItem("players", JSON.stringify(players));
    showRanking();
  }

  gameOverScreen.style.display = "flex";
};

const showRanking = () => {
  let rankingHTML = "<h2>Ranking</h2>";
  rankingHTML += "<ol>";
  players.sort((a, b) => b.score - a.score).forEach((player, index) => {
    rankingHTML += `<li>${player.name}: ${player.score}</li>`;
    if (index >= 4) return;
  });
  rankingHTML += "</ol>";
  rankingContainer.innerHTML = rankingHTML;
};

window.onload = showRanking;

const clearLocalStorage = () => {
  localStorage.removeItem("players");
  players = [];
  showRanking();
};

const restartGame = () => {
  // Salvar um indicador no localStorage para diferenciar entre restart e menu
  localStorage.setItem("restartGame", "true");
  location.reload();
};

const returnToMenu = () => {
  localStorage.setItem("restartGame", "false");
  location.reload();
};

window.onload = () => {
  showRanking();

  const restartGameFlag = localStorage.getItem("restartGame");

  if (restartGameFlag === "true") {
    localStorage.removeItem("restartGame");
    startGame();
  } else {
    menu.style.display = "flex";
    gameContainer.style.display = "none";
    gameOverScreen.style.display = "none";
  }
};
