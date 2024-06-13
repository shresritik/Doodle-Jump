import { Player, scoreCount } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { detectCollision, getRandomValue } from "./utils/utils";
import bgImg from "./assets/doodlejumpbg.png";
import { CANVAS_HEIGHT, CANVAS_WIDTH, COLOR } from "./constants/constants";
import { Enemy } from "./classes/Enemy";

const fallingSound = new Audio("./track/falling-sound-arcade.mp3");
const enemyDeath = new Audio("./track/barrel-explosion.mp3");
const jump = new Audio("./track/jump.wav");
const jumpMonster = new Audio("./track/jumponmonster-arcade.mp3");
const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;

canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundImage = `url("${bgImg}")`;
canvas.style.backgroundSize = `cover`;

fallingSound.volume = 0.2;

const ctx = canvas.getContext("2d")!;
let player: Player;
let gameOver = false;
let platformArray: Platform[] = [];
let enemyArray: Enemy[] = [];

enum GameState {
  Start,
  Playing,
  GameOver,
}

let currentState: GameState = GameState.Start;
let isPaused: boolean = false;
let lastFrameTime = performance.now();

function writeScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 10, 30);
}
function drawStartScreen() {
  ctx.fillStyle = "#F7F0EA";
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  ctx.fillText("Doodle Jump", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 - 80);
  ctx.font = "30px sans-serif";
  ctx.fillText("Press Space to Start", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Move Left: a key. Move Right:d key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 40
  );
  ctx.font = "22px sans-serif";
  ctx.fillText("Pause/Resume: p key", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + 70);
}

function drawPauseScreen() {
  ctx.fillStyle = COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText("Game Paused", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);
  ctx.fillText("Press P to Resume", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 50);
}

function gameOverFunction(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "40px sans-serif";
  ctx.fillText("Game Over", CANVAS_WIDTH / 4 + 20, CANVAS_HEIGHT / 2 - 50);
  let maxScore = localStorage.getItem("maxScore");
  ctx.font = "30px sans-serif";
  ctx.fillText(
    `High Score: ${maxScore}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2
  );
  ctx.fillText(
    `Your Score: ${scoreCount.score}`,
    CANVAS_WIDTH / 4 + 30,
    CANVAS_HEIGHT / 2 + 40
  );

  ctx.fillText(
    `Press Space to restart`,
    CANVAS_WIDTH / 4 - 20,
    CANVAS_HEIGHT / 2 + 100
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
  const moveHorizontally = Math.random() < 0.1;
  if (moveHorizontally) {
    const enemy1 = new Enemy(
      {
        x: getRandomValue(20, CANVAS_WIDTH - 100),
        y: getRandomValue(0, 50),
      },
      30,
      100,
      moveHorizontally
    );
    enemyArray.push(enemy1);
  }
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

const drawPlatform = (deltaTime: number) => {
  platformArray.forEach((pl) => {
    pl.draw(ctx);
    player.updateScore(pl);
    if (player.detectCollision(pl) && player.velocityY >= 0) {
      jump.play();
      player.velocityY = player.initialVelocityY;
    }
    if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
      pl.position.y -= (player.initialVelocityY * deltaTime) / 16.67;
    }
    if (pl.moveHorizontally) {
      pl.moveX(deltaTime);
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

const drawEnemy = (deltaTime: number) => {
  if (enemyArray.length == 0) {
    newEnemy();
  } else {
    enemyArray.forEach((enemy) => {
      enemy.draw(ctx);
      if (player.detectCollision(enemy)) {
        jumpMonster.play();
        gameOver = true;
      }
      enemy.moveX(deltaTime);
      if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
        enemy.position.y -= (player.initialVelocityY * deltaTime) / 16.67;
      }
    });
  }

  while (enemyArray.length > 0 && enemyArray[0].position.y >= CANVAS_HEIGHT) {
    enemyArray.shift();
    newEnemy();
  }
};

const createImage = () => {
  player = new Player({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 150 }, 50, 60);
};

function handleCollisions() {
  platformArray.forEach((pl) => {
    if (player.detectCollision(pl) && player.velocityY >= 0) {
      jump.play();
      player.velocityY = player.initialVelocityY;
    }
  });

  enemyArray.forEach((enemy) => {
    if (player.detectCollision(enemy)) {
      jumpMonster.play();
      gameOver = true;
    }
  });

  player.bulletArray.forEach((bullet, bulletIndex) => {
    enemyArray.forEach((enemy, enemyIndex) => {
      if (detectCollision(bullet, enemy)) {
        player.bulletArray.splice(bulletIndex, 1);
        enemyArray.splice(enemyIndex, 1);
        enemyDeath.play();
      }
    });
  });
}

function updateGameState(deltaTime: number) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (currentState === GameState.Start) {
    drawStartScreen();
  } else if (currentState === GameState.Playing) {
    if (isPaused) {
      drawPauseScreen();
      return;
    }

    if (gameOver) {
      currentState = GameState.GameOver;
      gameOverFunction(ctx);
      return;
    }

    drawPlatform(deltaTime);
    drawEnemy(deltaTime);
    handleCollisions();

    if (player.position.y > CANVAS_HEIGHT) {
      fallingSound.play();
      gameOver = true;
    }

    player.moveX(deltaTime);
    player.moveY(deltaTime);
    player.draw(ctx);
    player.updateBullets(ctx, deltaTime);

    writeScore(ctx);
  } else if (currentState === GameState.GameOver) {
    gameOverFunction(ctx);
  }
}

function gameLoop(currentTime: number) {
  if (!isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    updateGameState(deltaTime);
  }
  requestAnimationFrame(gameLoop);
}

function startGame() {
  gameOver = false;
  platformArray = [];
  initialPlatform();
  createPlatform();
  createImage();
  newEnemy();

  player.bulletArray = [];
  player.initialVelocityY = -7;
  player.velocityY = 20;
  player.gravity = 0.3;
  scoreCount.score = 0;
  player.maxHeight = CANVAS_HEIGHT;

  currentState = GameState.Playing;
  lastFrameTime = performance.now();
}

window.addEventListener("keypress", (e: KeyboardEvent) => {
  if (e.code === "Space") {
    if (
      currentState === GameState.Start ||
      currentState === GameState.GameOver
    ) {
      startGame();
    }
  }

  if (e.code === "KeyP" && currentState === GameState.Playing) {
    isPaused = !isPaused;
    if (!isPaused) {
      lastFrameTime = performance.now(); // Reset time to avoid time jump
      requestAnimationFrame(gameLoop);
    } else {
      drawPauseScreen();
    }
  }
});

// Start the game loop initially
requestAnimationFrame(gameLoop);
