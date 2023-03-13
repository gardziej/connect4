import Canvas from "./class/canvas";
import FpsLimiter from "./class/fpsLimiter";
import Mouse from "./class/mouse";
import Vector2 from "./class/vector2";
import Board from "./class/board";

export default class App {
  private fpsLimiter = new FpsLimiter(this);
  private canvas: Canvas = new Canvas('canvas');
  public mouse: Mouse;
  private children = new Map();
  private board: Board;
  
  constructor() {
    this.mouse = new Mouse(this.canvas);
    this.init();
  }

  private reset(): void {
  }

  private init(): void {
    this.reset();
    this.initBoard();
  }
  
  private initBoard(): void {
    const margin: number = 50;
    this.board = new Board(new Vector2(margin, margin), this.canvas.width - margin * 2, this.canvas.height - margin * 2, new Vector2(7, 6));
    this.children.set('board', this.board);
    this.board.handleMouseInput(this.mouse, this.canvas);
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
