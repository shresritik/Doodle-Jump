export interface IBase {
  position: { x: number; y: number };
  h: number;
  w: number;
  bulletY?: number;
}

export class Base implements IBase {
  position: { x: number; y: number };
  h: number;
  w: number;

  constructor(
    position: { x: number; y: number; bulletY?: number },
    h: number,
    w: number
  ) {
    this.position = { x: position.x, y: position.y };
    this.w = w;
    this.h = h;
  }
}
