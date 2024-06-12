import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/constants";
export const SPEED = 2;
export interface IPlatform {
  position: { x: number; y: number };
  h: number;
  w: number;
  color: string;
}
export class Platform implements IPlatform {
  position: { x: number; y: number };

  h: number;
  w: number;
  color: string;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    color: string
  ) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
    this.color = color;
  }
  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.position.x, this.position.y, this.w, this.h);
  };
  moveY = (velocity: number) => {
    if (this.position.y >= CANVAS_HEIGHT) {
      this.position.y += velocity * 20;
    } else {
      this.position.y -= velocity * SPEED;
    }
  };
  moveX = () => {
    if (this.position.x < 0) {
      this.position.x = CANVAS_WIDTH - this.w;
    } else if (this.position.x + this.w > CANVAS_WIDTH) {
      this.position.x = 0;
    }
  };
}
