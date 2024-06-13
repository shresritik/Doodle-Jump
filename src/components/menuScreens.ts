import { scoreCount } from "../classes/Player";
import { CANVAS_HEIGHT, CANVAS_WIDTH, COLOR } from "../constants/constants";
import { ctx } from "./canvas";

export function writeScore(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText(`Score: ${scoreCount.score}`, 10, 30);
}
export function drawStartScreen() {
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
  ctx.fillText("Bullet: f key ", CANVAS_WIDTH / 5, CANVAS_HEIGHT / 2 + 70);
  ctx.font = "22px sans-serif";
  ctx.fillText(
    "Pause/Resume: p key",
    CANVAS_WIDTH / 5,
    CANVAS_HEIGHT / 2 + 100
  );
}

export function drawPauseScreen() {
  ctx.fillStyle = COLOR;
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
  ctx.fillStyle = "red";
  ctx.font = "30px sans-serif";
  ctx.fillText("Game Paused", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2);
  ctx.fillText("Press P to Resume", CANVAS_WIDTH / 4, CANVAS_HEIGHT / 2 + 50);
}

export function gameOverFunction() {
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
