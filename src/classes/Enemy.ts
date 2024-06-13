import monsterImg from "../assets/monster.png";
import { CANVAS_WIDTH } from "../constants/constants";
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
  directionX: number;

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
    this.img.src = monsterImg;
    this.moveHorizontally = moveHorizontally;
    this.directionX = 1;
  }
  draw = (ctx: CanvasRenderingContext2D) => {
    ctx.drawImage(this.img, this.position.x, this.position.y, this.w, this.h);
  };

  moveX() {
    if (this.position.x <= 0 || this.position.x + this.w > CANVAS_WIDTH) {
      this.directionX *= -1;
    }
    this.position.x += this.directionX * SPEED;
  }
}
