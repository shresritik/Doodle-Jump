import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { getRandomValue } from "./utils/utils";
import bgImg from "./assets/doodlejumpbg.png";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/constants";
import { Enemy } from "./classes/Enemy";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
const startButton = document.getElementById("startButton") as HTMLButtonElement;
const btnWrapper = document.querySelector(".btn-wrapper") as HTMLDivElement;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundImage = `url("${bgImg}")`;
canvas.style.backgroundSize = `cover`;

const ctx = canvas.getContext("2d")!;
let player: Player;
let gameOver = false;
let platformArray: Platform[] = [];
let enemyArray: Enemy[] = [];
const enemySpawnHeight = CANVAS_HEIGHT * 0.75; // Threshold height for enemy spawning

function writeScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${player.score}`, 5, 20);
}

function gameOverFunction(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText(`Game over.`, CANVAS_WIDTH / 4 + 60, CANVAS_HEIGHT / 2);
  ctx.fillText(
    `Press Space to restart`,
    CANVAS_WIDTH / 4,
    (CANVAS_HEIGHT * 3) / 4 - 180
  );
}

function initialPlatform() {
  const platform1 = new Platform(
    {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 150,
    },
    30,
    100,
    "red"
  );
  platformArray.push(platform1);
}

function newPlatform() {
  const moveHorizontally = Math.random() < 0.3;
  const platform1 = new Platform(
    {
      x: getRandomValue(20, CANVAS_WIDTH - 100),
      y: 20,
    },
    30,
    100,
    "blue",
    moveHorizontally
  );
  platformArray.push(platform1);
}
function newEnemy() {
  const moveHorizontally = Math.random() < 0.2;
  const enemy1 = new Enemy(
    {
      x: getRandomValue(20, CANVAS_WIDTH - 100),
      y: 20,
    },
    30,
    100,
    moveHorizontally
  );
  enemyArray.push(enemy1);
}

function createPlatform() {
  for (let i = 0; i < 10; i++) {
    const moveHorizontally = Math.random() < 0.3;
    const platform = new Platform(
      {
        x: getRandomValue(20, CANVAS_WIDTH - 50),
        y: CANVAS_HEIGHT - 250 - i * 80,
      },
      30,
      100,
      "green",
      moveHorizontally
    );
    platformArray.push(platform);
  }
}

const drawPlatform = () => {
  platformArray.forEach((pl) => {
    pl.draw(ctx);
    player.updateScore(pl);
    if (player.detectCollision(pl) && player.velocityY >= 0) {
      player.velocityY = player.initialVelocityY;
    }
    if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
      pl.position.y -= player.initialVelocityY;
    }
    if (pl.moveHorizontally) {
      pl.moveX();
    }
  });

  while (
    platformArray.length > 0 &&
    platformArray[0].position.y >= CANVAS_HEIGHT
  ) {
    platformArray.shift();
    newPlatform();
  }
};

const drawEnemy = () => {
  enemyArray.forEach((enemy) => {
    enemy.draw(ctx);
    if (player.detectCollision(enemy)) {
      gameOver = true;
    }
    enemy.moveX();
    if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
      enemy.position.y -= player.initialVelocityY;
    }
  });
  while (enemyArray.length > 0 && enemyArray[0].position.y >= CANVAS_HEIGHT) {
    enemyArray.shift();
    newEnemy();
  }
};

const createImage = () => {
  player = new Player({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 150 }, 50, 60);
};

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (gameOver) {
    gameOverFunction(ctx);
    return;
  }

  if (player.position.y > CANVAS_HEIGHT) {
    gameOver = true;
  }

  ctx.beginPath();
  drawPlatform();
  drawEnemy();

  player.moveX();
  player.moveY();
  player.draw(ctx);

  writeScore(ctx);
  requestAnimationFrame(draw);
}

function startGame() {
  gameOver = false;
  platformArray = [];
  enemyArray = [];
  initialPlatform();
  createPlatform();
  createImage();
  newEnemy();
  // createEnemy();
  player.initialVelocityY = -5;
  player.velocityY = 12;
  player.gravity = 0.14;
  player.score = 0;
  player.maxHeight = CANVAS_HEIGHT;
  draw();
}

startButton.addEventListener("click", () => {
  startGame();
  btnWrapper.style.display = "none";
  startButton.style.display = "none";
});

function resetGame() {
  window.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.code === "Space" && gameOver) {
      startGame();
    }
  });
}

resetGame();
