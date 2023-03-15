import Drawable from "../interfaces/drawable.interface";
import Vector2 from "./vector2";

export default class Arrow implements Drawable {
  public clickable: boolean = false;
  public visible: boolean = false;
  public color: string = 'yellow';
  private marginTop: number = 25;

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
    ctx.moveTo(this.position.x + this.width / 2 - this.width / 8, this.marginTop + this.position.y + this.height / 4);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 8, this.marginTop + this.position.y + this.height / 4);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 8, this.marginTop + this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 + this.width / 4, this.marginTop + this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2, this.marginTop + this.position.y + this.height - this.height / 4);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 4, this.marginTop + this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 8, this.marginTop + this.position.y + this.height / 2);
    ctx.lineTo(this.position.x + this.width / 2 - this.width / 8, this.marginTop + this.position.y + this.height / 4);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

}