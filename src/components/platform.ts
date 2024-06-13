import { Platform } from "../classes/Platform";
import { Player } from "../classes/Player";
import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/constants";
import { getRandomValue } from "../utils/utils";
const jump = new Audio("/track/jump.wav");

type TPlatform = {
  platform: Platform[];
};
export const platformArray: TPlatform = { platform: [] };

export function initialPlatform() {
  const platform1 = new Platform(
    {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 150,
    },
    30,
    100,
    "red"
  );
  platformArray.platform.push(platform1);
}

export function newPlatform() {
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
  platformArray.platform.push(platform1);
}

export function createPlatform() {
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
    platformArray.platform.push(platform);
  }
}

export const drawPlatform = (deltaTime: number, player: Player) => {
  platformArray.platform.forEach((pl) => {
    pl.draw();
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
    platformArray.platform.length > 0 &&
    platformArray.platform[0].position.y >= CANVAS_HEIGHT
  ) {
    platformArray.platform.shift();
    newPlatform();
  }
};
