import { CANVAS_WIDTH } from "../constants/constants";
import { Platform, SPEED } from "./Platform";
import left from "../assets/blueL.png";
import right from "../assets/blueR.png";
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
  doodleLeft: HTMLImageElement | null;
  doodleRight: HTMLImageElement | null;
  keys: TKeys = {};
  velocityY = 0;
  initialVelocityY = -5.9;
  gravity = 0.21;
  maxScore = 0;
  score = 0;

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
    this.image.src = left;
    this.doodleLeft = null;
    this.doodleRight = null;
    this.velocityY = this.initialVelocityY;

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
      this.doodleLeft = new Image();
      this.doodleLeft.src = left;
    }
    if (this.keys["d"]) {
      this.position.x += SPEED;
      this.doodleRight = new Image();

      this.doodleRight.src = right;
    }
    this.checkBoundaries();
  }

  moveY() {
    // initially velocityY is negative so it moves upward and after adding gravity it moves downward
    this.velocityY += this.gravity;
    this.doodleRight = new Image();

    this.position.y += this.velocityY;
  }

  checkBoundaries() {
    if (this.position.x < 0) {
      this.position.x = CANVAS_WIDTH - this.w;
    } else if (this.position.x + this.w > CANVAS_WIDTH) {
      this.position.x = 0;
    }
  }

  detectCollision(b: Platform) {
    return (
      this.position.x < b.position.x + b.w &&
      this.position.x + this.w > b.position.x &&
      this.position.y < b.position.y + b.h &&
      this.position.y + this.h > b.position.y
    );
  }

  updateScore() {
    let points = 1;
    if (this.velocityY < 0) {
      this.maxScore += points;
      if (this.score < this.maxScore) {
        this.score = this.maxScore;
      }
    } else if (this.velocityY >= 0) {
      this.maxScore -= points;
    }
  }
}
