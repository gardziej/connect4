import Canvas from "./canvas";
import { fromEvent } from "rxjs";
import { filter, map } from "rxjs/operators";
import Vector2 from "./vector2";
import { Observable } from "rxjs/internal/Observable";

export default class Mouse {

  public down$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mousedown");
  public move$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mousemove");
  public up$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mouseup");
  public mousePosition$: Observable<Vector2> = this.move$.pipe(
    map((event: MouseEvent) => new Vector2(event.offsetX, event.offsetY))
  );
  public leftClick$: Observable<MouseEvent> = this.down$.pipe(
    filter((event: MouseEvent) => event.button === 0)
  );
  public leftUp$: Observable<MouseEvent> = this.up$.pipe(
    filter((event: MouseEvent) => event.button === 0)
  );
  public rightClick$: Observable<MouseEvent> = this.down$.pipe(
    filter((event: MouseEvent) => event.button === 2)
  );

  constructor(public canvas: Canvas) {
    this.canvas = canvas;
  }
}