import { Subject } from "rxjs";
import CellState from "../enum/cellState";
import Drawable from "../interfaces/drawable.interface";
import BoardCell from "./boardCell";
import Canvas from "./canvas";
import Mouse from "./mouse";
import Rectangle from "./rectangle";
import Vector2 from "./vector2";

export default class Board implements Drawable {
  private destroy$: Subject<boolean> = new Subject();
  public clickable: boolean = false;
  private background: Rectangle;
  private cells: BoardCell[][];

  constructor(
    public position: Vector2,
    public width: number,
    public height: number,
    public dim: Vector2
  ) {
    this.background = new Rectangle(this.position, this.width, this.height);
    this.createCells();
  }

  get cellSize(): number {
    return this.width / this.dim.x;
  }

  private createCells(): void {
    this.cells = Array.from(Array(this.dim.x), () => new Array(this.dim.y));
    for (let j = 0; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x; i++) {
        this.cells[i][j] = new BoardCell(
          this, 
          new Vector2(this.position.x + this.cellSize * i, this.position.y + this.cellSize * (j+1)), 
          this.cellSize, 
          this.cellSize, 
          new Vector2(i, j)
          );
      }
    }
    this.setCellState(new Vector2(1, 5), CellState.Player);
    this.setCellState(new Vector2(2, 4), CellState.Enemy);
  }

  getCellAtCoords(coords: Vector2): BoardCell {
    return this.cells[coords.x][coords.y];
  };

  private setCellState(coords: Vector2, cellState: CellState): void {
    this.getCellAtCoords(coords).state = cellState;
  }

  public handleMouseInput(mouse: Mouse, canvas: Canvas): void {

  }

  public update(): void {
    this.cells.flat().forEach(cell => cell.update());
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.background.render(ctx);
    this.cells.flat().forEach(cell => cell.render(ctx));
  }

  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}