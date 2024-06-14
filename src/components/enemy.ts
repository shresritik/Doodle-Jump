import { Enemy } from "../classes/Enemy";
import { Player } from "../classes/Player";
import {
  CANVAS_HEIGHT,
  CANVAS_WIDTH,
  gameStatus,
} from "../constants/constants";
import { detectCollision, getRandomValue } from "../utils/utils";
import { ctx } from "./canvas";
type TEnemy = {
  enemy: Enemy[];
};
const jumpMonster = new Audio("/track/jumponmonster-arcade.mp3");

export const enemyArray: TEnemy = { enemy: [] };
// create a new Enemy based on random probab less than 10%
export function newEnemy() {
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
    enemyArray.enemy.push(enemy1);
  }
}
// draw the enemy and check for collsiion
export const drawEnemy = (deltaTime: number, player: Player) => {
  if (enemyArray.enemy.length == 0) {
    newEnemy();
  } else {
    enemyArray.enemy.forEach((enemy) => {
      enemy.draw(ctx);
      if (detectCollision(player, enemy)) {
        jumpMonster.play();
        gameStatus.gameOver = true;
      }
      enemy.moveX(deltaTime);
      if (player.velocityY < 0 && player.position.y < (CANVAS_HEIGHT * 3) / 4) {
        enemy.position.y -= (player.initialVelocityY * deltaTime) / 16.67;
      }
    });
  }
  //create new enemy at different position in y axis by removing the enemy from array if it is not in canvas
  while (
    enemyArray.enemy.length > 0 &&
    enemyArray.enemy[0].position.y >= CANVAS_HEIGHT
  ) {
    enemyArray.enemy.shift();
    newEnemy();
  }
};
