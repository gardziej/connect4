import Canvas from "./class/canvas";
import FpsLimiter from "./class/fpsLimiter";
import Mouse from "./class/mouse";
import Vector2 from "./class/vector2";
import Board from "./class/board";
import GameState from "./enum/gameState";
import gameStateManager from "./class/gameStateManager";
import { randomBoolean } from "./utils/random";
import CellState from "./enum/cellState";
import bestMoveFinder from "./class/bestMoveFinder";
import Button from "./class/button";
import Header from "./class/header";
import GameLevel from "./enum/gameLevel";
import LevelButtons from "./class/levelButtons";

export default class App {
  private fpsLimiter = new FpsLimiter(this);
  private canvas: Canvas = new Canvas('canvas');
  private mouse: Mouse;
  private children = new Map();
  private board: Board;
  private nextGameButton: Button;
  private header: Header;
  private levelButtons: LevelButtons;
  public gameLevel: GameLevel;
  
  constructor() {
    this.mouse = new Mouse(this.canvas);
    this.handleMouseInput();

    gameStateManager.gameStateChanged$.subscribe((gameState: GameState) => {
      if (gameState === GameState.Init) {
        this.init();
        gameStateManager.gameStateChanged$.next(GameState.LevelChosen);
      }
      if (gameState === GameState.LevelChosen) {
        this.header.text = 'Wybierz poziom rozgrywki';
        this.header.show();
        this.nextGameButton.hide();
        this.levelButtons.show();
      }
      if (gameState === GameState.Start) {
        this.reset();
        const firstGameState: GameState = randomBoolean() ? GameState.PlayerMove : GameState.EnemyMove;
        gameStateManager.gameStateChanged$.next(firstGameState);
        this.board.setFirstMove(firstGameState);
      }
      if (gameState === GameState.PlayerMove) {
        this.board.arrow.visible = true;
      }
      if (gameState === GameState.EnemyMove) {
        this.board.arrow.visible = false;
        setTimeout(() => {
          const bestMoveColumn: number = bestMoveFinder.findBestMove(this.board.getDataForFinder(), this.board.firstMoveAI, this.gameLevel);
          this.board.makeMove(bestMoveColumn, CellState.Enemy);
          if (gameStateManager.getCurrentGameState() === GameState.EnemyMove) {
            gameStateManager.gameStateChanged$.next(GameState.PlayerMove);
          }
        }, 300);
      }
      if (gameState === GameState.PlayerWin) {
        this.board.arrow.visible = false;
        this.nextGameButton.text = 'gratulacje! zagramy jeszcze raz?';
        this.nextGameButton.show();
      }
      if (gameState === GameState.EnemyWin) {
        this.board.arrow.visible = false;
        this.nextGameButton.text = 'porażka! zagramy jeszcze raz?';
        this.nextGameButton.show();
      }
      if (gameState === GameState.Tie) {
        this.board.arrow.visible = false;
        this.nextGameButton.text = 'remis! zagramy jeszcze raz?';
        this.nextGameButton.show();
      }
    });

  }

  private reset(): void {
    this.levelButtons.hide();
    this.nextGameButton.hide();
    this.header.hide();
    this.board.reset();
  }

  private init(): void {
    this.initBoard();
    this.initNextGameButton();
    this.initHeader();
    this.initLevelButtons();
  }
  
  public start(gameLevel: GameLevel): void {
    this.gameLevel = gameLevel;
    gameStateManager.gameStateChanged$.next(GameState.Start);
  }

  private initBoard(): void {
    const margin: number = 50;
    this.board = new Board(new Vector2(margin, margin), this.canvas.width - margin * 2, this.canvas.height - margin * 2, new Vector2(7, 6));
    this.children.set('board', this.board);
    this.board.handleMouseInput(this.mouse);
  }

  private initNextGameButton(): void {
    this.nextGameButton = new Button(new Vector2(300, 100), 400, 40);
    this.nextGameButton.handleMouseInput(this.mouse, () => {
      setTimeout(() => {
        gameStateManager.gameStateChanged$.next(GameState.LevelChosen);
      }, 200);
    });
    this.children.set('nextGameButton', this.nextGameButton);
  }

  private initHeader(): void {
    this.header = new Header(new Vector2(50, 50), this.canvas.dim.x - 100, 50);
    this.header.text = 'Wybierz poziom rozgrywki';
    this.children.set('header', this.header);
  }

  private initLevelButtons(): void {
    this.levelButtons = new LevelButtons(this, new Vector2(50, 100), this.canvas.dim.x - 100, 80);
    this.levelButtons.handleMouseInput(this.mouse);
    this.children.set('levelButtons', this.levelButtons);
  }

  public handleMouseInput(): void {
    this.mouse.mousePosition$.subscribe((mousePosition: Vector2) => {
      if (Array.from(this.children.values()).some(child => child.isMouseOver(mousePosition))) {
        this.canvas.setPointerCursor();
      }
      else {
        this.canvas.setDefaultCursor();
      }
    });
  }

  public tick(): void {
    this.update();
    this.render();
  }

  public update(): void {
    Array.from(this.children.values()).forEach(child => child.update());
  }

  public render(): void {
    this.canvas.clear();
    Array.from(this.children.values()).forEach(child => child.render(this.canvas.ctx));
  }

}

new App();
