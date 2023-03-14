import { randomBoolean, randomInt } from "../utils/random";

enum Scores {
  column = 12,
  oddEven = 4,
  set3 = 50,
  set2 = 10,
  win = 10000
}

enum Token {
  Player = 'X',
  Enemy = 'O',
  Empty = '_'
}

class BestMoveFinder {

  private dataForFinder: string[][];
  private firstMoveAI: Token;


  private get width(): number {
    return this.dataForFinder[0].length;
  }

  private get height(): number {
    return this.dataForFinder.length;
  }

  trigger() {
    return this.findBestMove([
      ['_', '_', '_', '_', '_', '_', '_'],
      ['_', '_', '_', '_', '_', '_', '_'],
      ['_', '_', '_', '_', '_', '_', '_'],
      ['_', '_', 'X', '_', '_', '_', '_'],
      ['X', 'O', 'O', 'X', '_', '_', '_'],
      ['X', 'O', 'O', 'O', 'X', '_', '_'],
    ], true);
  }

  findBestMove(dataForFinder: string[][], firstMoveAI: boolean, level?: number): number {
    if (!level) {
      return this.findBestMoveEasy(dataForFinder, firstMoveAI);
    }
    else if (level === 1) {
      return this.findBestMoveMedium(dataForFinder, firstMoveAI);
    }
    else if (level === 2) {
      return this.findBestMoveHard(dataForFinder, firstMoveAI);
    }
  }

  findBestMoveHard(dataForFinder: string[][], firstMoveAI: boolean): number {
    return this.findBestMoveMedium(dataForFinder, firstMoveAI);
  }

  findBestMoveMedium(dataForFinder: string[][], firstMoveAI: boolean): number {
    this.firstMoveAI = firstMoveAI ? Token.Enemy : Token.Player;
    this.dataForFinder = dataForFinder;

    const columnScores = this.getValidColumns().map((column: number) => ({
      column,
      score: this.scoreMove(column, Token.Enemy)
    }));
    columnScores.sort((a, b) => b.score - a.score);

    // this.logData();
    return columnScores[0].column;
  }

  findBestMoveEasy(dataForFinder: string[][], firstMoveAI: boolean): number {
    this.firstMoveAI = firstMoveAI ? Token.Enemy : Token.Player;
    this.dataForFinder = dataForFinder;

    const columnScores = this.getValidColumns().map((column: number) => ({
      column, 
      score: this.scoreMove(column, Token.Enemy)
    }));
    columnScores.sort((a, b) => b.score - a.score);

    // this.logData();
    return Math.random() > 0.3 && columnScores.length > 1 && columnScores[1].score > 0 
      ? columnScores[1].column
      : columnScores[0].column
  }

  private scoreMove(column: number, token: Token): number {
    let score: number = 0;
    const row: number = this.getValidRowInColumn(column);
    if (row === null) {
      return -Infinity;
    }

    this.dataForFinder[row][column] = token;

    // points for column
    score += this.getScoreForColumn(column);

    // points for odd/even row
    if (!this.firstMoveAI && ((this.height - row - 1) % 2) || this.firstMoveAI && !(((this.height - row - 1)) % 2)) {
      score += Scores.oddEven;
    }

    // points for horizontal sets
    for (let j = 0; j < this.height; j++) {
      for (let i = 0; i < this.width - 3; i++) {
        score += this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j][i + 1],
          this.dataForFinder[j][i + 2], this.dataForFinder[j][i + 3]], token);
        score -= this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j][i + 1],
        this.dataForFinder[j][i + 2], this.dataForFinder[j][i + 3]], this.getOppToken(token));
      }
    }

    // points for vertical sets
    for (let j = 0; j < this.height - 3; j++) {
      for (let i = 0; i < this.width; i++) {
        score += this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j + 1][i],
          this.dataForFinder[j + 2][i], this.dataForFinder[j + 3][i]], token);
        score -= this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j + 1][i],
          this.dataForFinder[j + 2][i], this.dataForFinder[j + 3][i]], this.getOppToken(token));
      }
    }

    // points for diagonal down sets
    for (let j = 0; j < this.height - 3; j++) {
      for (let i = 0; i < this.width - 3; i++) {
        score += this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j + 1][i + 1],
          this.dataForFinder[j + 2][i + 2], this.dataForFinder[j + 3][i + 3]], token);
        score -= this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j + 1][i + 1],
          this.dataForFinder[j + 2][i + 2], this.dataForFinder[j + 3][i + 3]], this.getOppToken(token));
      }
    }

    // points for diagonal up sets
    for (let j = 3; j < this.height; j++) {
      for (let i = 0; i < this.width - 3; i++) {
        score += this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j - 1][i + 1],
          this.dataForFinder[j - 2][i + 2], this.dataForFinder[j - 3][i + 3]], token);
        score -= this.getSetValue([this.dataForFinder[j][i], this.dataForFinder[j - 1][i + 1],
          this.dataForFinder[j - 2][i + 2], this.dataForFinder[j - 3][i + 3]], this.getOppToken(token));
      }
    }

    // console.log('PRG: score', score, 'for', column); // TODO remove this
    this.dataForFinder[row][column] = Token.Empty;
    return score;
  }

  private getSetValue(set: string[], token: Token): number {
    let value: number = 0;
    const boostModifier: number = 10;
    const good: number = set.filter(s => s === token).length;
    const empty: number = set.filter(s => s === Token.Empty).length;
    if (token === Token.Enemy) {
      if (good === 4) {
        value = Scores.win * boostModifier * boostModifier;
      } else if (good === 3 && empty === 1) {
        value = Scores.set3;
      } else if (good === 2 && empty === 2) {
        value = Scores.set2;
      }
    }
    else {
      if (good === 4) {
        value = Scores.win * Infinity;
      } else if (good === 3 && empty === 1) {
        value = Scores.win * boostModifier;
      } else if (good === 2 && empty === 2) {
        value = Scores.set3;
      }
    }
    // console.log('PRG: setv', set.join(), value); // TODO remove this
    return value;
  }

  private getValidRowInColumn(column: number): number {
    if (this.dataForFinder[0][column] !== Token.Empty) {
      return null;
    }
    let row: number = this.height - 1;
    while (this.dataForFinder[row][column] !== Token.Empty) {
      row--;
    }
    return row;
  }

  private getValidColumns() {
    return this.dataForFinder[0].reduce<number[]>((acc: number[], val: string, index: number) => {
      if (val === Token.Empty) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
  }

  private getScoreForColumn(column: number): number {
    const centerColumn: number = Math.floor(this.width / 2);
    return Scores.column - Math.abs(column - centerColumn);
  }

  private getOppToken(token: Token): Token {
    return token === Token.Enemy ? Token.Player : Token.Enemy;
  }

  public logData(): void {
    const cells: string[][] = this.dataForFinder;
    console.log('DATA                   ');
    console.log('DATA     0 1 2 3 4 5 6');
    console.log('DATA     -------------');
    cells.forEach((row: string[], index: number) => {
      console.log('DATA', index, '|', row.join(' '), '|', index);
    });
    console.log('DATA     -------------');
    console.log('DATA     0 1 2 3 4 5 6');
    console.log('DATA                   ');
  }
}



const bestMoveFinder: BestMoveFinder = new BestMoveFinder();
export default bestMoveFinder;