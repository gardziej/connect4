import GameLevel from "../enum/gameLevel";
import Button from "./button";
import Vector2 from "./vector2";

export default class LevelButton extends Button {

  public constructor(
    public position: Vector2,
    public width: number,
    public height: number,
    public text: string,
    public level: GameLevel
  ) {
    super(position, width, height, text);
  }
}