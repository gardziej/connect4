import Drawable from "../interfaces/drawable.interface";
import Vector2 from "./vector2";

export default class Rectangle implements Drawable {
  public clickable: boolean = false;

  public color: string = 'white';
  public rounds: number[] = [0, 0, 0, 0];

  constructor(
    public position: Vector2,
    public width: number,
    public height: number,
  ) {
  }

  public update(): void {
  }

  public render(ctx: CanvasRenderingContext2D): void {
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.roundRect(this.position.x, this.position.y, this.width, this.height, this.rounds);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  public contains(p: Vector2): boolean {
    return Rectangle.containsPoint(this, p);
  }

  static containsPoint(rec: Drawable, p: Vector2) {
    return p.x > rec.position.x && p.y > rec.position.y && p.x < rec.position.x + rec.width && p.y < rec.position.y + rec.height;
  }
}