import CellState from "../enum/cellState";
import Drawable from "../interfaces/drawable.interface";
import Board from "./board";
import Vector2 from "./vector2";

export default class BoardCell implements Drawable {

  public state: CellState = CellState.Empty;

  constructor(
    public board: Board,
    public position: Vector2,
    public width: number,
    public height: number,
    public boardCoords: Vector2
  ) {
  }

  get cellSize(): number {
    return this.board.cellSize;
  }

  get stateSign(): string {
    switch (this.state) {
      case CellState.Empty: return '_';
      case CellState.Player: return 'X';
      case CellState.Enemy: return 'O';
    }
  }

  public update(): void {
    
  }

  public render(ctx: CanvasRenderingContext2D): void {
    
    if (this.state !== CellState.Empty) {
      ctx.save();
      ctx.beginPath();
      ctx.fillStyle = this.state === CellState.Player ? 'yellow' : 'red';
      ctx.arc(this.position.x + this.cellSize / 2, this.position.y + this.cellSize / 2, this.cellSize / 2.5, 0, 2 * Math.PI);
      ctx.fill();
      ctx.restore();
    }
    
    this.drawCellMask(ctx, this.position, this.cellSize, 75, ['rgb(0, 0, 128)', 'rgb(0, 0, 98)']);
  }

  private drawCellMask(ctx: CanvasRenderingContext2D, position: Vector2, size: number, circlePercent: number, colors: string[]) {
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x, position.y), size / 2, circlePercent, 0, colors[0]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x + size / 2, position.y), size / 2, circlePercent, 90, colors[1]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x + size / 2, position.y + size / 2), size / 2, circlePercent, 180, colors[0]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x, position.y + size / 2), size / 2, circlePercent, 270, colors[1]);
  }

  private drawBezierOvalQuarter(ctx: CanvasRenderingContext2D, position: Vector2, size: number, circlePercent: number, angle: number, color: string) {
    const circleSize: number = size * circlePercent / 100;
    const margin: number = size - circleSize;
    ctx.save();
    ctx.fillStyle = color;
    if (angle) {
      ctx.translate(position.x + size / 2, position.y + size / 2);
      ctx.rotate(angle * Math.PI / 180);
      ctx.translate(-position.x - size / 2, -position.y - size / 2);
    }
    ctx.beginPath();
    const centerX: number = position.x + size;
    const centerY: number = position.y + size;
    const start: Vector2 = new Vector2(centerX - (circleSize), centerY - (0));
    const cp1: Vector2 = new Vector2(centerX - (circleSize), centerY - (0.552 * circleSize));
    const cp2: Vector2 = new Vector2(centerX - (0.552 * circleSize), centerY - (circleSize));
    const end: Vector2 = new Vector2(centerX - (0), centerY - (circleSize));
    ctx.moveTo(start.x, start.y);
    ctx.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, end.x, end.y);
    ctx.lineTo(position.x + size, position.y);
    ctx.lineTo(position.x, position.y);
    ctx.lineTo(position.x, position.y + size);
    ctx.lineTo(position.x + margin, position.y + size);
    ctx.fill();
    ctx.restore();
  }

}

