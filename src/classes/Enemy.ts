import { CANVAS_HEIGHT, CANVAS_WIDTH } from "../constants/constants";
import platformImg from "../assets/platform.png";
export const SPEED = 2;
export interface IEnemy {
  position: { x: number; y: number };
  h: number;
  w: number;
}
export class Enemy implements IEnemy {
  position: { x: number; y: number };

  h: number;
  w: number;
  img: HTMLImageElement;
  moveHorizontally: boolean;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    moveHorizontally: boolean = false
  ) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
    this.img = new Image();
    this.img.src = platformImg;
    this.moveHorizontally = moveHorizontally;
  }
  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(this.img, this.position.x, this.position.y, this.w, this.h);
  };

  moveX() {
    if (this.moveHorizontally) {
      this.position.x += Math.sin(Date.now() / 500) * SPEED; // Move back and forth
    }
  }
}
