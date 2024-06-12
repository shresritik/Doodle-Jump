import { CANVAS_WIDTH } from "../constants/constants";
import { SPEED } from "./Platform";

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
  image: HTMLImageElement;
}

interface TKeys {
  [keys: string]: boolean;
}

export class Player implements IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
  image: HTMLImageElement;
  keys: TKeys = {};
  verticalDistance: number = 0.5;
  gravity: number = 0.98;
  constructor(
    position: { x: number; y: number },
    h: number,
    w: number,
    img: string
  ) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
    this.image = new Image();
    this.image.src = img;
    // Bind the event handlers
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
  }

  keyDownHandler(e: KeyboardEvent) {
    this.keys[e.key] = true;
  }

  keyUpHandler(e: KeyboardEvent) {
    this.keys[e.key] = false;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.drawImage(this.image, this.position.x, this.position.y, this.w, this.h);
  }

  moveX() {
    if (this.keys["a"]) {
      this.position.x -= SPEED;
    }
    if (this.keys["d"]) {
      this.position.x += SPEED;
    }
    // this.checkBoundaries();
  }
  moveY() {
    this.position.y += this.verticalDistance * SPEED;
  }

  checkBoundaries() {
    if (this.position.x < 0) {
      this.position.x = CANVAS_WIDTH;
    } else if (this.position.x + this.w > CANVAS_WIDTH) {
      this.position.x = 0;
    }
  }
}
