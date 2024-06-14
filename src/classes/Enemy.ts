import monsterImg from "../assets/monster.png";
import { CANVAS_WIDTH, SPEED } from "../constants/constants";
import { Base } from "./Base";

export class Enemy extends Base {
  img: HTMLImageElement;
  moveHorizontally: boolean;
  directionX: number;

  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    moveHorizontally: boolean = false
  ) {
    super(position, h, w);
    this.img = new Image();
    this.img.src = monsterImg;
    this.moveHorizontally = moveHorizontally;
    this.directionX = 1;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.position.x, this.position.y, this.w, this.h);
  }

  moveX(deltaTime: number) {
    if (this.position.x <= 0 || this.position.x + this.w > CANVAS_WIDTH) {
      this.directionX *= -1;
    }
    this.position.x += this.directionX * SPEED * (deltaTime / 16.67); // Normalize to 60 FPS
  }
}
