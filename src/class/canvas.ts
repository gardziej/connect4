import Boundaries from "./boundaries";
import Vector2 from "./vector2";

export default class Canvas {

  public ctx: CanvasRenderingContext2D;
  public canvas: HTMLCanvasElement;
  private canvasOffset: Vector2;

  constructor(
    private id: string,
    public dim: Vector2 = Vector2.zero
  ) {
    this.canvas = document.createElement('canvas');
    this.canvas.addEventListener('contextmenu', (event) => {
      event.preventDefault();
    });
    if (!dim.isZero) {
      this.canvas.width = dim.x;
      this.canvas.height = dim.y;
    } else {
      dim.x = this.canvas.width = 1000;
      dim.y = this.canvas.height = 1000;
    }
    this.canvas.setAttribute('id', this.id);
    document.body.appendChild(this.canvas);
    this.ctx = this.canvas.getContext("2d");
    this.canvasOffset = new Vector2(this.canvas.offsetLeft, this.canvas.offsetTop);
  }

  get width(): number {
    return this.canvas.width;
  }

  get height(): number {
    return this.canvas.height;
  }

  get offset(): Vector2 {
    return this.canvasOffset;
  }

  clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  getBoundaries(): Boundaries {
    return new Boundaries(Vector2.zero, new Vector2(this.canvas.width, this.canvas.height));
  }

  setDefaultCursor(): void {
    this.canvas.style.cursor = 'default';
  }

  setPointerCursor(): void {
    this.canvas.style.cursor = 'pointer';
  }

  setMoveCursor(): void {
    this.canvas.style.cursor = 'move';
  }

}