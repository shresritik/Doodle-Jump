import { CANVAS_HEIGHT } from "../constants/constants";
import platformImg from "../assets/platform.png";
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
  img: HTMLImageElement;
  moveHorizontally: boolean;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    color: string,
    moveHorizontally: boolean = false
  ) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
    this.color = color;
    this.img = new Image();
    this.img.src = platformImg;
    this.moveHorizontally = moveHorizontally;
  }
  draw = (ctx: CanvasRenderingContext2D) => {
    // ctx.fillStyle = this.color;
    // ctx.fillRect(this.position.x, this.position.y, this.w, this.h);

    ctx.drawImage(this.img, this.position.x, this.position.y, this.w, this.h);
  };
  moveY = (velocity: number) => {
    if (this.position.y >= CANVAS_HEIGHT) {
      this.position.y += velocity * 20;
    } else {
      this.position.y -= velocity * SPEED;
    }
  };
  moveX() {
    if (this.moveHorizontally) {
      this.position.x += Math.sin(Date.now() / 500) * SPEED; // Move back and forth
    }
  }
}
