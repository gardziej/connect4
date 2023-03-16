import CellState from "../enum/cellState";
import Drawable from "../interfaces/drawable.interface";
import Board from "./board";
import Vector2 from "./vector2";

export default class BoardCell implements Drawable {

  public state: CellState = CellState.Empty;
  public initPosition: Vector2;
  private speed: number = 10;

  public constructor(
    public board: Board,
    public position: Vector2,
    public width: number,
    public height: number,
    public boardCoords: Vector2
  ) {
    this.initPosition = this.position;
  }

  public get cellSize(): number {
    return this.board.cellSize;
  }

  public get stateSign(): string {
    switch (this.state) {
      case CellState.Empty: return '_';
      case CellState.Player: return 'X';
      case CellState.Enemy: return 'O';
    }
  }

  public setCellState(state: CellState): void {
    this.state = state;
    this.initPosition = new Vector2(this.position.x, this.board.position.y);
    this.speed = Math.max(10, 2.5 * ((this.position.y - this.initPosition.y) / 100));
  }

  public update(): void {
    if (this.state !== CellState.Empty && this.initPosition.y < this.position.y) {
      this.initPosition.y += this.speed;
    } else {
      this.initPosition.y = this.position.y;
    }
  }

  public render(ctx: CanvasRenderingContext2D): void {
    
    if (this.state !== CellState.Empty) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.state === CellState.Player ? 'yellow' : 'red';
      ctx.arc(this.initPosition.x + this.cellSize / 2, this.initPosition.y + this.cellSize / 2, this.cellSize / 2.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.beginPath();
      ctx.fillStyle = this.state === CellState.Player ? 'rgb(225, 225, 0)' : 'rgb(225, 0, 0)';
      ctx.strokeStyle = this.state === CellState.Player ? 'rgb(255, 225, 0)' : 'rgb(225, 100, 100)';
      ctx.arc(this.initPosition.x + this.cellSize / 2, this.initPosition.y + this.cellSize / 2, this.cellSize / 5, 0, 2 * Math.PI);
      ctx.stroke();
      ctx.fill();
      ctx.restore();
    }
  }
}

