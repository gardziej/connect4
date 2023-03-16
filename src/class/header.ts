import Clickable from "../interfaces/clickable.interface";
import Drawable from "../interfaces/drawable.interface";
import Rectangle from "./rectangle";
import Vector2 from "./vector2";

export default class Header implements Drawable, Clickable {
  public clickable: boolean = false;
  public visible: boolean = false;
  public background: Rectangle;
  public text: string = '';

  public isMouseOver(mousePosition: Vector2): boolean {
    return this.clickable && Rectangle.containsPoint(this, mousePosition);
  }

  public constructor(
    public position: Vector2,
    public width: number,
    public height: number,
  ) {
    this.background = new Rectangle(this.position, this.width, this.height);
  }

  public show(): void {
    this.visible = true;
  }

  public hide(): void {
    this.visible = false;
  }

  public update(): void {
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.background.render(ctx);
    ctx.save();
    ctx.strokeStyle = 'black';
    ctx.font = Math.floor(this.height * 2 / 5) + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.position.x + this.width / 2, this.position.y + this.height * 0.66);
    ctx.restore();
  }

}