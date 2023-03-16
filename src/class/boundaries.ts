import Vector2 from "./vector2";

export default class Boundaries {

  public constructor(
    public topLeft: Vector2,
    public bottomRight: Vector2
  ) {
  }

  public contains(pointPosition: Vector2): boolean {
    return pointPosition.x >= this.topLeft.x &&
      pointPosition.x < this.bottomRight.x &&
      pointPosition.y >= this.topLeft.y &&
      pointPosition.y < this.bottomRight.y;
  }

  public toString(): string {
    return `tl: ${this.topLeft.x}, ${this.topLeft.y}, br: ${this.bottomRight.x}, ${this.bottomRight.y}`;
  }

}