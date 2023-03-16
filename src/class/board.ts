import { OperatorFunction, Subject } from "rxjs";
import { takeUntil, filter, map } from "rxjs/operators";
import CellState from "../enum/cellState";
import GameState from "../enum/gameState";
import Drawable from "../interfaces/drawable.interface";
import { mapMouseEventToPosition } from "../utils/rxjsHelpers";
import BoardCell from "./boardCell";
import gameStateManager from "./gameStateManager";
import Mouse from "./mouse";
import Rectangle from "./rectangle";
import Arrow from "./arrow";
import Vector2 from "./vector2";

export default class Board implements Drawable {
  private destroy$: Subject<boolean> = new Subject();
  public clickable: boolean = true;
  private background: Rectangle;
  private cells: BoardCell[][];
  public arrow: Arrow = new Arrow(new Vector2(this.position.x, this.position.y), this.cellSize, this.cellSize);
  public firstMoveAI: boolean;
  public endCoords: Vector2[] = [];

  public constructor(
    public position: Vector2,
    public width: number,
    public height: number,
    public dim: Vector2
  ) {
    this.background = new Rectangle(this.position, this.width, this.height);
    this.reset();
  }

  public get cellSize(): number {
    return this.width / this.dim.x;
  }

  public reset(): void {
    this.createCells();
    this.endCoords = [];
  }

  public setFirstMove(firstGameState: GameState): void {
    this.firstMoveAI = firstGameState === GameState.PlayerMove;
  }

  public isMouseOver(mousePosition: Vector2): boolean {
    const column: number = Math.floor((mousePosition.x - this.position.x) / this.cellSize);
    return gameStateManager.getCurrentGameState() === GameState.PlayerMove &&
      column >= 0 && column < this.dim.x &&
      this.cells[0][column]?.state === CellState.Empty;
  }

  private createCells(): void {
    this.cells = Array.from(Array(this.dim.y), () => new Array(this.dim.x));
    for (let j = 0; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x; i++) {
        this.cells[j][i] = new BoardCell(
          this, 
          new Vector2(this.position.x + this.cellSize * i, this.position.y + this.cellSize * (j+1)), 
          this.cellSize, 
          this.cellSize, 
          new Vector2(i, j)
          );
      }
    }
  }

  public getCellAtCoords(coords: Vector2): BoardCell {
    return this.cells[coords.y][coords.x];
  }

  private setCellState(coords: Vector2, cellState: CellState): void {
    this.getCellAtCoords(coords).setCellState(cellState);
  }

  public handleMouseInput(mouse: Mouse): void {
    mouse.leftClick$.pipe(
      takeUntil(this.destroy$),
      filter(() => Boolean(gameStateManager.getCurrentGameState() === GameState.PlayerMove)),
      mapMouseEventToPosition(),
      filter((mousePosition: Vector2) => this.isMouseOver(mousePosition)),
      this.mapMousePositionToColumn(),
      filter((column: number) => column >= 0 && column < this.dim.x),
    ).subscribe((column: number) => {
        this.makeMove(column, CellState.Player);
    });

    mouse.move$.pipe(
      takeUntil(this.destroy$),
      filter(() => Boolean(gameStateManager.getCurrentGameState() === GameState.PlayerMove)),
      mapMouseEventToPosition(),
      this.mapMousePositionToColumn(),
    ).subscribe((column: number) => {
      if (column >= 0 && column < this.dim.x) {
        this.hoverOverColumn(column);
      }
    });
  }

  public makeMove(column: number, state: CellState): boolean {
    if (this.cells[0][column].state !== CellState.Empty) {
      return false;
    }

    let row: number = this.dim.y - 1;
    while (this.cells[row][column].state !== CellState.Empty) {
      row--;
    }
    this.setCellState(new Vector2(column, row), state);

    const endCoords: Vector2[] = this.checkForEndCondition();
    if (endCoords) {
      setTimeout(() => {
        this.endCoords.push(endCoords[0], endCoords[endCoords.length - 1]);
      }, 1000);
      return false;
    }

    gameStateManager.gameStateChanged$.next(
      gameStateManager.getCurrentGameState() === GameState.PlayerMove ? GameState.EnemyMove : GameState.PlayerMove
    );

    return true;
  }

  public checkForEndCondition(): Vector2[] {
    // No more moves
    if (this.noPossibleMove()) {
      gameStateManager.gameStateChanged$.next(GameState.Tie);
      return [new Vector2(0, 0), new Vector2(this.dim.y - 1, this.dim.x - 1)];
    }
    // Vertical
    for (let j = 0; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const testWindow = [new Vector2(j, i), new Vector2(j, i + 1), new Vector2(j, i + 2), new Vector2(j, i + 3)];
        const test: CellState = this.testFourCells(
          testWindow.map((coords: Vector2) => this.cells[coords.x][coords.y].state)
        );
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return testWindow;
        }
      }
    }
    // Horizontal
    for (let j = 0; j < this.dim.y - 3; j++) {
      for (let i = 0; i < this.dim.x; i++) {
        const testWindow = [new Vector2(j, i), new Vector2(j + 1, i), new Vector2(j + 2, i), new Vector2(j + 3, i)];
        const test: CellState = this.testFourCells(
          testWindow.map((coords: Vector2) => this.cells[coords.x][coords.y].state)
        );
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return testWindow;
        }
      }
    }
    // Diagonal down
    for (let j = 0; j < this.dim.y - 3; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const testWindow = [new Vector2(j, i), new Vector2(j + 1, i + 1), new Vector2(j + 2, i + 2), new Vector2(j + 3, i + 3)];
        const test: CellState = this.testFourCells(
          testWindow.map((coords: Vector2) => this.cells[coords.x][coords.y].state)
        );
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return testWindow;
        }
      }
    }
    // Diagonal up
    for (let j = 3; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const testWindow = [new Vector2(j, i), new Vector2(j - 1, i + 1), new Vector2(j - 2, i + 2), new Vector2(j - 3, i + 3)];
        const test: CellState = this.testFourCells(
          testWindow.map((coords: Vector2) => this.cells[coords.x][coords.y].state)
        );
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return testWindow;
        }
      }
    }
    return null;
  }

  private testFourCells(testCellStates: CellState[]): CellState {
    if (testCellStates.every((state: CellState) => state === CellState.Player)) {
      return CellState.Player;
    }
    if (testCellStates.every((state: CellState) => state === CellState.Enemy)) {
      return CellState.Enemy;
    }
    return null;
  }

  private noPossibleMove(): boolean {
    return this.cells[0].every((cell: BoardCell) => cell.state !== CellState.Empty);
  }

  private hoverOverColumn(column: number): void {
    this.arrow.position = new Vector2(this.position.x + this.cellSize * column, this.position.y);
  }

  public update(): void {
    this.cells.flat().forEach(cell => cell.update());
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.background.render(ctx);
    this.cells.flat().forEach((cell: BoardCell) => cell.render(ctx));
    this.cells.flat().forEach((cell: BoardCell) => {
      this.drawCellMask(ctx, cell.position, cell.cellSize, 75, ['rgb(0, 0, 128)', 'rgb(0, 0, 98)']);
    });
    this.arrow.render(ctx);
    this.renderEndPosition(ctx);
  }

  private renderEndPosition(ctx: CanvasRenderingContext2D): void {
    if (this.endCoords.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.lineWidth = 10;
      ctx.lineCap = "round";
      ctx.strokeStyle = "green";
      ctx.moveTo(
        this.position.y + this.cellSize / 2 + this.endCoords[0].y * this.cellSize,
        this.position.x + this.cellSize + this.cellSize / 2 + this.endCoords[0].x * this.cellSize
        );
      ctx.lineTo(
        this.position.y + this.cellSize / 2 + this.endCoords[1].y * this.cellSize,
        this.position.x + this.cellSize + this.cellSize / 2 + this.endCoords[1].x * this.cellSize
      );
      ctx.stroke();
      ctx.restore();
    }
  }


  private mapMousePositionToColumn(): OperatorFunction<Vector2, number> {
    return map((mousePosition: Vector2) => this.mousePositionToColumn(mousePosition));
  }

  private mousePositionToColumn(mousePosition: Vector2): number {
    return Math.floor((mousePosition.x - this.position.x) / this.cellSize);
  }

  public getDataForFinder(): string[][] {
    return this.cells.map((row: BoardCell[]) => row.map((cell: BoardCell) => cell.stateSign));
  }

  private drawCellMask(ctx: CanvasRenderingContext2D, position: Vector2, size: number, circlePercent: number, colors: string[]): void {
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x, position.y), size / 2, circlePercent, 0, colors[0]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x + size / 2, position.y), size / 2, circlePercent, 90, colors[1]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x + size / 2, position.y + size / 2), size / 2, circlePercent, 180, colors[0]);
    this.drawBezierOvalQuarter(ctx, new Vector2(position.x, position.y + size / 2), size / 2, circlePercent, 270, colors[1]);
  }

  private drawBezierOvalQuarter(ctx: CanvasRenderingContext2D, position: Vector2, size: number, circlePercent: number, angle: number, color: string): void {
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


  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}