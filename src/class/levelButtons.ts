import { Subject } from "rxjs";
import { takeUntil, filter, map } from "rxjs/operators";
import App from "../app";
import GameLevel from "../enum/gameLevel";
import Drawable from "../interfaces/drawable.interface";
import { mapMouseEventToPosition } from "../utils/rxjsHelpers";
import Button from "./button";
import LevelButton from "./levelButton";
import Mouse from "./mouse";
import Vector2 from "./vector2";

export default class LevelButtons implements Drawable {
  private destroy$: Subject<boolean> = new Subject();
  private buttons: LevelButton[];
  private buttonWidth: number = 150;
  private buttonHeight: number = 40;
  constructor(
    private app: App,
    public position: Vector2,
    public width: number,
    public height: number
  ) {
    this.buttons = [
      new LevelButton(
        new Vector2(
          this.position.x + (this.width - this.buttonWidth) / 2 - this.buttonWidth * 1.5, 
          this.position.y + (this.height - this.buttonHeight) / 2), 
        this.buttonWidth, 
        this.buttonHeight, 
        'łatwy',
        GameLevel.Easy),
      new LevelButton(
        new Vector2(
          this.position.x + (this.width - this.buttonWidth) / 2, 
          this.position.y + (this.height - this.buttonHeight) / 2), 
        this.buttonWidth, 
        this.buttonHeight, 
        'średni',
        GameLevel.Medium),
      new LevelButton(
        new Vector2(
          this.position.x + (this.width - this.buttonWidth) / 2 + this.buttonWidth * 1.5, 
          this.position.y + (this.height - this.buttonHeight) / 2), 
        this.buttonWidth, 
        this.buttonHeight, 
        'trudny',
        GameLevel.Hard)
    ];
  }

  public hide(): void {
    this.buttons.forEach((button: LevelButton) => button.hide());
  }

  public show(): void {
    this.buttons.forEach((button: LevelButton) => button.show());
  }

  public handleMouseInput(mouse: Mouse): void {
    mouse.leftClick$.pipe(
      takeUntil(this.destroy$),
      mapMouseEventToPosition(),
      filter((mousePosition: Vector2) => this.isMouseOver(mousePosition)),
      map((mousePosition: Vector2) => {
        let clickedButton: LevelButton;
        this.buttons.forEach((button: LevelButton) => {
          if (button.isMouseOver(mousePosition)) {
            clickedButton = button;
            return button;
          }});
        return clickedButton;
      })).subscribe((button: LevelButton) => {
        this.app.start(button.level);
      });

  }

  public isMouseOver(mousePosition: Vector2): boolean {
    return this.buttons.some((button: LevelButton) => button.isMouseOver(mousePosition));
  }

  public update(): void {
    this.buttons.forEach((button: LevelButton) => button.update());
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.buttons.forEach((button: LevelButton) => button.render(ctx));
  }

  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}