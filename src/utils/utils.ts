import { Bullet } from "../classes/Bullet";
import { Enemy } from "../classes/Enemy";

export function getRandomValue(min: number, max: number): number {
  const maxValue = Math.ceil(max);
  const minValue = Math.floor(min);
  const value = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  return value;
}

export function detectCollision(player: Bullet, other: Enemy) {
  return (
    player.position.x < other.position.x + other.w &&
    player.position.x + player.w > other.position.x &&
    player.position.y < other.position.y + other.h &&
    player.position.y + player.h > other.position.y
  );
}
