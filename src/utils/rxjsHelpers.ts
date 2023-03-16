import { OperatorFunction } from "rxjs";
import { map } from "rxjs/operators";
import Vector2 from "../class/vector2";

export function mapMouseEventToPosition(): OperatorFunction<MouseEvent, Vector2> {
  return map((mouseEvent: MouseEvent) => new Vector2(mouseEvent.offsetX, mouseEvent.offsetY));
}