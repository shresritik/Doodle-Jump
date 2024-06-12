import { Player } from "./classes/Player";
import { Platform } from "./classes/Platform";
import { getRandomValue } from "./utils/utils";
import bgImg from "./assets/bg.png";
import blueL from "./assets/blueL.png";

const canvas = document.getElementById("gameCanvas") as HTMLCanvasElement;
export const CANVAS_WIDTH = 600;
export const CANVAS_HEIGHT = 1000;
canvas.width = CANVAS_WIDTH;
canvas.height = CANVAS_HEIGHT;
canvas.style.backgroundImage = `url("${bgImg}")`;

const ctx = canvas.getContext("2d")!;
let player: Player;
let gameOver = false;
let platformArray: Platform[] = [];

function writeScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  ctx.fillText(`Score: ${player.score}`, 5, 20);
}
function gameOverFunction(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "black";
  ctx.font = "20px sans-serif";
  if (gameOver)
    ctx.fillText(
      `Gameover Press Space to restart`,
      CANVAS_WIDTH / 7,
      (CANVAS_HEIGHT * 7) / 8
    );
}
function initialPlatform() {
  const platform1 = new Platform(
    {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 150,
    },
    20,
    100,
    "red"
  );

  platformArray.push(platform1);
}

function createPlatform() {
  for (let i = 0; i < 8; i++) {
    const platform = new Platform(
      {
        x: getRandomValue(20, CANVAS_WIDTH - 50),
        y: CANVAS_HEIGHT - 250 - i * 80,
      },
      10,
      50,
      "green"
    );
    platformArray.push(platform);
  }
}

const drawPlatform = () => {
  platformArray.forEach((pl) => {
    pl.draw(ctx);
    if (player.detectCollision(pl) && player.velocityY >= 0) {
      player.velocityY = player.initialVelocityY;
    }
    if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
      pl.position.y -= player.initialVelocityY;
    }
  });

  while (
    platformArray.length > 0 &&
    platformArray[0].position.y >= CANVAS_HEIGHT
  ) {
    platformArray.splice(0, 1);
    createPlatform();
  }
};

const createImage = () => {
  player = new Player(
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 150 },
    50,
    60,
    blueL
  );
};

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  if (gameOver) {
    gameOverFunction(ctx);

    resetGame();
  }

  if (player.position.y > CANVAS_HEIGHT) {
    gameOver = true;
  }
  ctx.beginPath();
  drawPlatform();
  player.moveX();
  player.moveY();
  player.updateScore();
  player.draw(ctx);
  writeScore(ctx);
  requestAnimationFrame(draw);
}
initialPlatform();
createPlatform();
createImage();
draw();
function resetGame() {
  window.addEventListener("keypress", (e: KeyboardEvent) => {
    if (e.code == "Space" && gameOver) {
      platformArray.length = 0;

      initialPlatform();

      createImage();
      gameOver = false;
      createPlatform();
    }
  });
}
