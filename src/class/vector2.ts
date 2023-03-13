/*eslint @typescript-eslint/no-explicit-any: ["off"]*/

export default class Vector2 {

  public x: number;
  public y: number;

  constructor()
  constructor(v: Vector2)
  constructor(x: number, y: number)
  constructor(a?: any, b?: any) {
    if (a instanceof Vector2 && typeof b === 'undefined') {
      this.x = a.x;
      this.y = a.y;
    }
    else {
      this.x = typeof a !== 'undefined' ? a : 0;
      this.y = typeof b !== 'undefined' ? b : 0;
    }
  }

  static get zero(): Vector2 {
    return new Vector2();
  }

  get isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  addTo(v: Vector2): Vector2
  addTo(n: number): Vector2
  addTo(a: any): Vector2 {
    if (a instanceof Vector2) {
      this.x += a.x;
      this.y += a.y;
    }
    else if (typeof a === 'number') {
      this.x += a;
      this.y += a;
    }
    return this;
  }

  add(v: Vector2): Vector2
  add(n: number): Vector2
  add(v: any) {
    return this.copy().addTo(v);
  }

  subtractFrom(v: Vector2): Vector2
  subtractFrom(n: number): Vector2
  subtractFrom(a: any): Vector2 {
    if (a instanceof Vector2) {
      this.x -= a.x;
      this.y -= a.y;
    }
    else if (typeof a === 'number') {
      this.x -= a;
      this.y -= a;
    }
    return this;
  }

  subtract(v: Vector2): Vector2
  subtract(n: number): Vector2
  subtract(v: any) {
    return this.copy().subtractFrom(v);
  }

  divideBy(v: Vector2): Vector2
  divideBy(n: number): Vector2
  divideBy(a: any): Vector2 {
    if (a instanceof Vector2) {
      this.x /= a.x;
      this.y /= a.y;
    }
    else if (typeof a === 'number') {
      this.x /= a;
      this.y /= a;
    }
    return this;
  }

  divide(v: Vector2): Vector2
  divide(n: number): Vector2
  divide(a: any) {
    return this.copy().divideBy(a);
  }

  multiplyWith(v: Vector2): Vector2
  multiplyWith(n: number): Vector2
  multiplyWith(a: any): Vector2 {
    if (a instanceof Vector2) {
      this.x *= a.x;
      this.y *= a.y;
    }
    else if (typeof a === 'number') {
      this.x *= a;
      this.y *= a;
    }
    return this;
  }

  multiply(v: Vector2): Vector2
  multiply(n: number): Vector2
  multiply(a: any) {
    return this.copy().multiplyWith(a);
  }

  toString(): string {
    return "(" + this.x + ", " + this.y + ")";
  }

  copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  equals(obj: Vector2): boolean {
    return this.x === obj.x && this.y === obj.y;
  }

}