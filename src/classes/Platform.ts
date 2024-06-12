import { CANVAS_HEIGHT } from "../constants/constants";
export const SPEED = 2;
interface IPlatform {
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
  verticalDistance: number = 0.5;
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
  moveY = () => {
    if (this.position.y >= CANVAS_HEIGHT) {
      this.position.y = -20;
    } else {
      this.position.y += this.verticalDistance * SPEED;
    }
  };
}
