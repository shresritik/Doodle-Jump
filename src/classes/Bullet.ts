import { ctx } from "../main";
import { TKeys } from "./Player";

export class Bullet {
  position: { x: number; y: number };
  h: number;
  w: number;
  keys: TKeys = {};

  velocityY = 12;
  bullet: number | null = null;
  bulletSpeed: number | null = 0.5;
  constructor(position: { x: number; y: number }, h: number, w: number) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
    this.velocityY = 1.5;
  }

  drawBullet() {
    ctx.fillStyle = "red";
    ctx.fillRect(this.position.x, this.position.y, 10, 8);
  }

  // Method to move the bullet

  moveBulletY() {
    this.position.y -= this.velocityY;
  }
}
