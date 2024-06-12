import { Player } from "./classes/Player.ts";
import { Platform } from "./classes/Platform.ts";
import { getRandomValue } from "./utils/utils.ts";
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

let platformArray: Platform[] = [];
function drawPlatform() {
  for (let i = 0; i < 8; i++) {
    const platform = new Platform(
      {
        x: getRandomValue(0, CANVAS_WIDTH - 100),
        y: i * 100,
      },
      20,
      100,
      "green"
    );
    platformArray.push(platform);
  }
}
const createPlatform = () => {
  platformArray.forEach((pl) => {
    pl.draw(ctx);
    pl.moveY();
  });
};
const createImage = () => {
  player = new Player(
    { x: CANVAS_WIDTH / 2, y: CANVAS_HEIGHT - 300 },
    50,
    60,
    blueL
  );
};

function draw() {
  ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.beginPath();
  createPlatform();
  player.draw(ctx);
  player.moveX();
  requestAnimationFrame(draw);
}
drawPlatform();
createImage();
draw();
