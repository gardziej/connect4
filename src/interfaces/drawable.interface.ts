import Vector2 from "../class/vector2";

export default interface Drawable {
  position: Vector2;
  width: number;
  height: number;
  update(): void;
  render(ctx: CanvasRenderingContext2D): void;
}