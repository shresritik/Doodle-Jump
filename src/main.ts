import { Player, scoreCount } from "./classes/Player";
import { detectCollision, getRandomValue } from "./utils/utils";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "./constants/constants";
import { Enemy } from "./classes/Enemy";
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
const fallingSound = new Audio("/track/falling-sound-arcade.mp3");
const enemyDeath = new Audio("/track/barrel-explosion.mp3");
const jump = new Audio("/track/jump.wav");
const jumpMonster = new Audio("/track/jumponmonster-arcade.mp3");

fallingSound.volume = 0.2;
let player: Player;
let gameOver = false;
let enemyArray: Enemy[] = [];

enum GameState {
  Start,
  Playing,
  GameOver,
}

let currentState: GameState = GameState.Start;
let isPaused: boolean = false;
let lastFrameTime = performance.now();
// create a new Enemy based on random probab less than 10%
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
// draw the enemy and check for collsiion
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
  //create new enemy at different position in y axis by removing the enemy from array if it is not in canvas
  while (enemyArray.length > 0 && enemyArray[0].position.y >= CANVAS_HEIGHT) {
    enemyArray.shift();
    newEnemy();
  }
};
//instantiate a Player object
const createImage = () => {
  player = new Player({ x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 150 }, 50, 60);
};
//collision between platform and player , enemy and player
function handleCollisions() {
  platformArray.platform.forEach((pl) => {
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
//check the game stats for same fps in all the devices
// functions for start,pause and game over screens
// main game function calls
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
      gameOverFunction();
      return;
    }

    drawPlatform(deltaTime, player);
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
    gameOverFunction();
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
// initiate the variables
function startGame() {
  gameOver = false;
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
