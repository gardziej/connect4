import Drawable from "../interfaces/drawable.interface";
import Vector2 from "./vector2";

export default class Arrow implements Drawable {
  public clickable: boolean = false;
  public visible: boolean = false;
  public color: string = 'yellow';

  constructor(
    public position: Vector2,
    public width: number,
    public height: number
  ) {
  }

  public update(): void {
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if(!this.visible) return;
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.position.x + this.width / 2 - this.width / 6, this.position.y + this.height / 6);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 6, this.position.y + this.height / 6);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 6, this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 3, this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2, this.position.y + this.height - this.height / 6);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 3, this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 6, this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 6, this.position.y + this.height / 6);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

}