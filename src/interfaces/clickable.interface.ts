import Vector2 from "../class/vector2";

export default interface Clickable {
  clickable: boolean;
  isMouseOver(mousePosition: Vector2): boolean;
}