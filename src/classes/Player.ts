import { CANVAS_WIDTH, SPEED } from "../constants/constants";
import { Platform } from "./Platform";
import left from "../assets/blueL.png";
import right from "../assets/blueR.png";
import { Bullet } from "./Bullet";
import { detectCollision } from "../utils/utils";
const playerDeathByMonster = new Audio("/track/arcade-laser.mp3");

interface IPlayer {
  position: { x: number; y: number };
  h: number;
  w: number;
  image: HTMLImageElement;
}
let maxScore: number = 0;
export interface TKeys {
  [keys: string]: boolean;
}
export let scoreCount = { score: 0 };

export class Player implements IPlayer {
  position: { x: number; y: number; bulletY: number };
  h: number;
  w: number;
  image: HTMLImageElement;
  keys: TKeys = {};
  initialVelocityY = -7;
  velocityY = 20;
  gravity = 0.3;

  maxHeight = 0;
  lastPlatform: Platform | null = null;
  bulletArray: Bullet[] = [];

  constructor(position: { x: number; y: number }, h: number, w: number) {
    this.position = { x: position.x, y: position.y, bulletY: position.y };
    this.w = w;
    this.h = h;
    this.image = new Image();
    this.image.src = left;
    this.velocityY = this.initialVelocityY;
    this.keyDownHandler = this.keyDownHandler.bind(this);
    this.keyUpHandler = this.keyUpHandler.bind(this);

    document.addEventListener("keydown", this.keyDownHandler);
    document.addEventListener("keyup", this.keyUpHandler);
    document.addEventListener("keypress", (e) => {
      if (e.key == "f") {
        playerDeathByMonster.play();
        this.drawBullet();
      }
    });
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

  drawBullet() {
    const bullet = new Bullet(
      { x: this.position.x, y: this.position.y },
      20,
      30
    );
    this.bulletArray.push(bullet);
  }

  updateBullets(ctx: CanvasRenderingContext2D, deltaTime: number) {
    this.bulletArray.forEach((bullet, index) => {
      bullet.moveBulletY(deltaTime);
      bullet.drawBullet(ctx);
      // Remove bullets that are out of screen
      if (bullet.position.y < 0) {
        this.bulletArray.splice(index, 1);
      }
    });
  }

  moveX(deltaTime: number) {
    const movementSpeed = (SPEED * deltaTime) / 16.67; // Normalize to 60 FPS

    if (this.keys["a"]) {
      this.position.x -= movementSpeed;
      this.image.src = left;
    }
    if (this.keys["d"]) {
      this.position.x += movementSpeed;
      this.image.src = right;
    }

    this.checkBoundaries();
  }

  moveY(deltaTime: number) {
    // Initially velocityY is negative so it moves upward and after adding gravity it moves downward
    this.velocityY += (this.gravity * deltaTime) / 16.67; // Normalize to 60 FPS
    this.position.y += (this.velocityY * deltaTime) / 16.67; // Normalize to 60 FPS
  }

  checkBoundaries() {
    if (this.position.x < 0) {
      this.position.x = CANVAS_WIDTH - this.w;
    } else if (this.position.x + this.w > CANVAS_WIDTH) {
      this.position.x = 0;
    }
  }

  // if the player is in new platform and is not bouncing than increase score
  updateScore(platform: Platform) {
    if (
      detectCollision(this, platform) &&
      this.velocityY >= 0 &&
      platform !== this.lastPlatform
    ) {
      scoreCount.score++;
      this.lastPlatform = platform;

      if (maxScore < scoreCount.score) {
        maxScore = scoreCount.score;
        localStorage.setItem("maxScore", JSON.stringify(maxScore));
      }
    }
  }
}
