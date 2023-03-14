import { Subject } from "rxjs";
import { filter, takeUntil } from "rxjs/operators";
import Clickable from "../interfaces/clickable.interface";
import Drawable from "../interfaces/drawable.interface";
import { mapMouseEventToPosition } from "../utils/rxjsHelpers";
import Mouse from "./mouse";
import Rectangle from "./rectangle";
import Vector2 from "./vector2";

export default class Button implements Drawable, Clickable {
  private destroy$: Subject<boolean> = new Subject();
  public clickable: boolean = false;

  public background: Rectangle;
  public text: string = 'button';
  public visible: boolean = false;

  constructor(
    public position: Vector2,
    public width: number,
    public height: number,
  ) {
    this.background = new Rectangle(this.position, this.width, this.height);
    this.background.color = 'green';
    this.background.rounds = [5, 5, 5, 5];
  }

  public hide() {
    this.visible = false;
    this.clickable = false;
  }

  public show() {
    this.visible = true;
    this.clickable = true;
  }

  public handleMouseInput(mouse: Mouse, onClickCallback: () => void): void {
    mouse.leftClick$.pipe(
      takeUntil(this.destroy$),
      mapMouseEventToPosition(),
      filter((mousePosition: Vector2) => this.isMouseOver(mousePosition)),
      filter(() => Boolean(this.clickable)),
    ).subscribe(() => onClickCallback());
  }

  public isMouseOver(mousePosition: Vector2): boolean {
    return this.clickable && Rectangle.containsPoint(this, mousePosition);
  }

  public update(): void {
  }

  public render(ctx: CanvasRenderingContext2D): void {
    if (!this.visible) return;
    this.background.render(ctx);
    ctx.save();
    ctx.fillStyle = 'white';
    ctx.font = Math.floor(this.height * 3 / 5) + "px Arial";
    ctx.textAlign = "center";
    ctx.fillText(this.text, this.position.x + this.width / 2, this.position.y + this.height * 0.66);
    ctx.restore();
  }

  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}