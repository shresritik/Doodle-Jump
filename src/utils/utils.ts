import { Bullet } from "../classes/Bullet";
import { Enemy } from "../classes/Enemy";
/**
 * Generates a random integer value between min (inclusive) and max (exclusive).
 * @param min The minimum value (inclusive).
 * @param max The maximum value (exclusive).
 * @returns A random integer value between min and max.
 */
export function getRandomValue(min: number, max: number): number {
  const maxValue = Math.ceil(max);
  const minValue = Math.floor(min);
  const value = Math.floor(Math.random() * (maxValue - minValue) + minValue);
  return value;
}
/**
 * Checks if a player's bullet collides with an enemy.
 * @param player The player's bullet.
 * @param other The enemy to check collision against.
 * @returns True if there is a collision, false otherwise.
 */
export function detectCollision(player: Bullet, other: Enemy) {
  return (
    player.position.x < other.position.x + other.w &&
    player.position.x + player.w > other.position.x &&
    player.position.y < other.position.y + other.h &&
    player.position.y + player.h > other.position.y
  );
}
