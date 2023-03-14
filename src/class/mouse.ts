import Canvas from "./canvas";
import { fromEvent } from "rxjs";
import { auditTime, filter, map, tap } from "rxjs/operators";
import Vector2 from "./vector2";
import { Observable } from "rxjs/internal/Observable";

export default class Mouse {

  private mousePosition: Vector2;

  public down$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mousedown");
  public move$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mousemove");
  public up$: Observable<MouseEvent> = fromEvent<MouseEvent>(this.canvas.canvas, "mouseup");

  public mousePosition$: Observable<Vector2> = this.move$.pipe(
    map((event: MouseEvent) => new Vector2(event.offsetX, event.offsetY)),
    tap((mousePosition: Vector2) => this.mousePosition = mousePosition)
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