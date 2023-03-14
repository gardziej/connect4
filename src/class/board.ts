import { Subject } from "rxjs";
import { takeUntil, filter, map, tap } from "rxjs/operators";
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

  constructor(
    public position: Vector2,
    public width: number,
    public height: number,
    public dim: Vector2
  ) {
    this.background = new Rectangle(this.position, this.width, this.height);
    this.reset();
  }

  get cellSize(): number {
    return this.width / this.dim.x;
  }

  public reset(): void {
    this.createCells();
  }

  public setFirstMove(firstGameState: GameState) {
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

  getCellAtCoords(coords: Vector2): BoardCell {
    return this.cells[coords.y][coords.x];
  };

  private setCellState(coords: Vector2, cellState: CellState): void {
    this.getCellAtCoords(coords).state = cellState;
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
    if (this.checkForEndCondition()) {
      return false;
    }

    gameStateManager.gameStateChanged$.next(
      gameStateManager.getCurrentGameState() === GameState.PlayerMove ? GameState.EnemyMove : GameState.PlayerMove
    );

    return true;
  }

  public checkForEndCondition(): boolean {
    // No more moves
    if (this.noPossibleMove()) {
      gameStateManager.gameStateChanged$.next(GameState.Tie);
      return true;
    }
    // Horizontal
    for (let j = 0; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const test: CellState = this.testFourCells([this.cells[j][i].state, this.cells[j][i + 1].state,
          this.cells[j][i + 2].state, this.cells[j][i + 3].state]);
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return true;
        }
      }
    }
    // Vertical
    for (let j = 0; j < this.dim.y - 3; j++) {
      for (let i = 0; i < this.dim.x; i++) {
        const test: CellState = this.testFourCells([this.cells[j][i].state, this.cells[j + 1][i].state,
          this.cells[j + 2][i].state, this.cells[j + 3][i].state]);
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return true;
        }
      }
    }
    // Diagonal down
    for (let j = 0; j < this.dim.y - 3; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const test: CellState = this.testFourCells([this.cells[j][i].state, this.cells[j + 1][i + 1].state,
          this.cells[j + 2][i + 2].state, this.cells[j + 3][i + 3].state]);
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return true;
        }
      }
    }
    // Diagonal up
    for (let j = 3; j < this.dim.y; j++) {
      for (let i = 0; i < this.dim.x - 3; i++) {
        const test: CellState = this.testFourCells([this.cells[j][i].state, this.cells[j - 1][i + 1].state,
          this.cells[j - 2][i + 2].state, this.cells[j - 3][i + 3].state]);
        if (test) {
          gameStateManager.gameStateChanged$.next(test === CellState.Player ? GameState.PlayerWin : GameState.EnemyWin);
          return true;
        }
      }
    }
    return false;
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

  private hoverOverColumn(column: number) {
    this.arrow.position = new Vector2(this.position.x + this.cellSize * column, this.position.y);
  }

  public update(): void {
    this.cells.flat().forEach(cell => cell.update());
  }

  public render(ctx: CanvasRenderingContext2D): void {
    this.background.render(ctx);
    this.cells.flat().forEach(cell => cell.render(ctx));
    this.arrow.render(ctx);
  }

  private mapMousePositionToColumn() {
    return map((mousePosition: Vector2) => this.mousePositionToColumn(mousePosition));
  }

  private mousePositionToColumn(mousePosition: Vector2) {
    return Math.floor((mousePosition.x - this.position.x) / this.cellSize);
  }

  public getDataForFinder(): string[][] {
    return this.cells.map((row: BoardCell[]) => row.map((cell: BoardCell) => cell.stateSign));
  }

  public logData(): void {
    const cells: string[][] = this.getDataForFinder();
    console.log('DATA   0 1 2 3 4 5 6'); // TODO remove this
    cells.forEach((row: string[], index: number) => {
      console.log('DATA', index, row.join(' ')); // TODO remove this
    });
  }

  public destroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
    this.destroy$.unsubscribe();
  }

}