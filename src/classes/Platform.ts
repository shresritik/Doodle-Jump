import { CANVAS_HEIGHT, SPEED } from "../constants/constants";
import platformImg from "../assets/platform.png";

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

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.img, this.position.x, this.position.y, this.w, this.h);
  }

  moveY(velocity: number, deltaTime: number) {
    if (this.position.y >= CANVAS_HEIGHT) {
      this.position.y += velocity * 20 * (deltaTime / 16.67); // Normalize to 60 FPS
    } else {
      this.position.y -= velocity * SPEED * (deltaTime / 16.67); // Normalize to 60 FPS
    }
  }

  moveX(deltaTime: number) {
    if (this.moveHorizontally) {
      this.position.x +=
        Math.sin(Date.now() / 500) * SPEED * (deltaTime / 16.67); // Normalize to 60 FPS
    }
  }
}
