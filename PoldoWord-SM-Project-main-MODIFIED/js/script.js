const mario = document.querySelector(".mario");
const pipe = document.querySelector(".pipe");
const menu = document.getElementById("menu");
const gameContainer = document.getElementById("game");
const scoreElement = document.getElementById("score");
const rankingContainer = document.getElementById("ranking");
const gameOverScreen = document.getElementById("game-over");
const jumpSound = document.getElementById("jumpSound");
const deathSound = document.getElementById("deathSound");

let score = 0;
let passedPipe = false;
let currentPlayer = "";
let players = JSON.parse(localStorage.getItem("players")) || [];
let gameInterval;

const jump = () => {
  mario.classList.add("jump");
  jumpSound.currentTime = 0; // Rewind to the start
  jumpSound.play(); // Play the jump sound
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

  // Check if Mario collides with the pipe
  if (pipePosition <= 70 && pipePosition > 0 && marioPosition < 100) {
    gameOver();
  } 

  // Check if Mario successfully passes the pipe
  if (pipePosition < 0 && !passedPipe) {
    score++;
    updateScore();
    passedPipe = true;

    // Reset passedPipe after the pipe has completely moved out of the screen
    setTimeout(() => {
      passedPipe = false;
    }, 1500); // Adjust the time based on the pipe animation speed
  }
};

const confirmNameAndStartGame = () => {
  var audio = document.getElementById("audio");
  audio.pause(); 
  
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
  passedPipe = false; // Reiniciar o estado de passedPipe

  pipe.style.animation = "pipe-animation 1.5s infinite linear"; // Reiniciar animação do pipe
  mario.src = "./images/mario.gif"; // Garantir que o Mario esteja no estado correto
  mario.style.width = "100px"; // Reiniciar o tamanho do Mario
  mario.style.marginLeft = "0"; // Reiniciar a posição do Mario

  gameInterval = setInterval(checkCollisions, 10);
};

const gameOver = () => {
  clearInterval(gameInterval);
  pipe.style.animation = "none";
  pipe.style.left = `${pipe.offsetLeft}px`;

  mario.style.animation = "none";
  mario.style.bottom = `${+window.getComputedStyle(mario).bottom.replace("px", "")}px`;

  mario.src = "./images/game-over-mario.png";
  mario.style.width = "105px";
  mario.style.marginLeft = "30px";

  deathSound.currentTime = 0; // Rewind to the start
  deathSound.play(); // Play the death sound
  
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

document.addEventListener("DOMContentLoaded", function() {
  var logo = document.getElementById('logo');
  logo.classList.add('logo-animation');
});
