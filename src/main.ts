import { Player, scoreCount } from "./classes/Player";
import { detectCollision } from "./utils/utils";
import { CANVAS_HEIGHT, CANVAS_WIDTH, gameStatus } from "./constants/constants";
import {
  drawPauseScreen,
  drawStartScreen,
  gameOverFunction,
  writeScore,
} from "./components/menuScreens";
import { ctx } from "./components/canvas";
import {
  createPlatform,
  drawPlatform,
  initialPlatform,
  platformArray,
} from "./components/platform";
import { drawEnemy, enemyArray, newEnemy } from "./components/enemy";
const fallingSound = new Audio("/track/falling-sound-arcade.mp3");
const enemyDeath = new Audio("/track/barrel-explosion.mp3");
const jump = new Audio("/track/jump.wav");
const jumpMonster = new Audio("/track/jumponmonster-arcade.mp3");

fallingSound.volume = 0.2;
let player: Player;

enum GameState {
  Start,
  Playing,
  GameOver,
}

let currentState: GameState = GameState.Start;
let lastFrameTime = performance.now();

//instantiate a Player object
const createImage = () => {
  player = new Player({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 150 }, 50, 60);
};
//collision between platform and player , enemy and player
function handleCollisions() {
  platformArray.platform.forEach((pl) => {
    if (detectCollision(player, pl) && player.velocityY >= 0) {
      jump.play();
      player.velocityY = player.initialVelocityY;
    }
  });

  enemyArray.enemy.forEach((enemy) => {
    if (detectCollision(player, enemy)) {
      jumpMonster.play();
      gameStatus.gameOver = true;
    }
  });

  player.bulletArray.forEach((bullet, bulletIndex) => {
    enemyArray.enemy.forEach((enemy, enemyIndex) => {
      if (detectCollision(bullet, enemy)) {
        player.bulletArray.splice(bulletIndex, 1);
        enemyArray.enemy.splice(enemyIndex, 1);
        enemyDeath.play();
      }
    });
  });
}
//check the game stats for same fps in all the devices
// functions for start,pause and game over screens
// main game function calls
function updateGameState(deltaTime: number) {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (currentState === GameState.Start) {
    drawStartScreen();
  } else if (currentState === GameState.Playing) {
    if (gameStatus.isPaused) {
      drawPauseScreen();
      return;
    }

    if (gameStatus.gameOver) {
      currentState = GameState.GameOver;
      gameOverFunction();
      return;
    }

    drawPlatform(deltaTime, player);
    drawEnemy(deltaTime, player);
    handleCollisions();

    if (player.position.y > CANVAS_HEIGHT) {
      fallingSound.play();
      gameStatus.gameOver = true;
    }

    player.moveX(deltaTime);
    player.moveY(deltaTime);
    player.draw(ctx);
    player.updateBullets(ctx, deltaTime);

    writeScore(ctx);
  } else if (currentState === GameState.GameOver) {
    gameOverFunction();
  }
}

function gameLoop(currentTime: number) {
  if (!gameStatus.isPaused) {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    updateGameState(deltaTime);
  }
  requestAnimationFrame(gameLoop);
}
// initiate the variables
function startGame() {
  gameStatus.gameOver = false;
  platformArray.platform = [];
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
    gameStatus.isPaused = !gameStatus.isPaused;
    if (!gameStatus.isPaused) {
      lastFrameTime = performance.now(); // Reset time to avoid time jump
      requestAnimationFrame(gameLoop);
    } else {
      drawPauseScreen();
    }
  }
});

// Start the game loop initially
requestAnimationFrame(gameLoop);
