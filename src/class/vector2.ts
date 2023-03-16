/*eslint @typescript-eslint/no-explicit-any: ["off"]*/

export default class Vector2 {

  public x: number;
  public y: number;

  public constructor()
  public constructor(v: Vector2)
  public constructor(x: number, y: number)
  public constructor(a?: any, b?: any) {
    if (a instanceof Vector2 && typeof b === 'undefined') {
      this.x = a.x;
      this.y = a.y;
    }
    else {
      this.x = typeof a !== 'undefined' ? a : 0;
      this.y = typeof b !== 'undefined' ? b : 0;
    }
  }

  public static get zero(): Vector2 {
    return new Vector2();
  }

  public get isZero(): boolean {
    return this.x === 0 && this.y === 0;
  }

  public get length(): number {
    return Math.sqrt(this.x * this.x + this.y * this.y);
  }

  public addTo(v: Vector2): Vector2
  public addTo(n: number): Vector2
  public addTo(a: any): Vector2 {
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

  public add(v: Vector2): Vector2
  public add(n: number): Vector2
  public add(v: any): Vector2 {
    return this.copy().addTo(v);
  }

  public subtractFrom(v: Vector2): Vector2
  public subtractFrom(n: number): Vector2
  public subtractFrom(a: any): Vector2 {
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

  public subtract(v: Vector2): Vector2
  public subtract(n: number): Vector2
  public subtract(v: any): Vector2 {
    return this.copy().subtractFrom(v);
  }

  public divideBy(v: Vector2): Vector2
  public divideBy(n: number): Vector2
  public divideBy(a: any): Vector2 {
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

  public divide(v: Vector2): Vector2
  public divide(n: number): Vector2
  public divide(a: any): Vector2 {
    return this.copy().divideBy(a);
  }

  public multiplyWith(v: Vector2): Vector2
  public multiplyWith(n: number): Vector2
  public multiplyWith(a: any): Vector2 {
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

  public multiply(v: Vector2): Vector2
  public multiply(n: number): Vector2
  public multiply(a: any): Vector2 {
    return this.copy().multiplyWith(a);
  }

  public toString(): string {
    return "(" + this.x + ", " + this.y + ")";
  }

  public copy(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  public equals(obj: Vector2): boolean {
    return this.x === obj.x && this.y === obj.y;
  }

}