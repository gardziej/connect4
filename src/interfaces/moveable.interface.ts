import Vector2 from "../class/vector2";

export default interface Moveable {
  velocity: Vector2;
  acceleration: Vector2;
  friction: Vector2;
}