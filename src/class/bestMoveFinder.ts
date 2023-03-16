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

interface ScoreAndColumn {
  score: number;
  column: number;
}

type Board = string[][];

class BestMoveFinder {
  private firstMoveAI: Token;


  private width(board: Board): number {
    return board[0].length;
  }

  private height(board: Board): number {
    return board.length;
  }

  public trigger(): ScoreAndColumn {
    return this.minimax([
      ['_', '_', '_', '_', '_', '_', '_'],
      ['_', '_', '_', '_', '_', '_', '_'],
      ['_', '_', '_', 'O', '_', '_', '_'],
      ['_', '_', '_', 'X', 'O', '_', '_'],
      ['_', '_', 'O', 'O', 'X', 'X', '_'],
      ['_', '_', 'X', 'O', 'X', 'X', '_'],
    ], 2, true);
  }

  public findBestMove(dataForFinder: Board, firstMoveAI: boolean, level?: number): number {
    this.firstMoveAI = firstMoveAI ? Token.Enemy : Token.Player;
    if (!level) {
      return this.findBestMoveEasy(dataForFinder);
    }
    else if (level === 1) {
      return this.findBestMoveMedium(dataForFinder);
    }
    else if (level === 2) {
      return this.findBestMoveHard(dataForFinder);
    }
  }
  private findBestMoveHard(board: Board): number {
    const minimax: ScoreAndColumn = this.minimax(board, 5, true);
    return minimax.column;
  }

  private findBestMoveMedium(board: Board): number {
    const minimax: ScoreAndColumn = this.minimax(board, 2, true);
    return minimax.column;
  }

  private findBestMoveEasy(board: Board): number {
    const columnScores = this.getValidColumns(board).map((column: number) => ({
      column, 
      score: this.scoreMove(board, column, Token.Enemy)
    }));
    columnScores.sort((a, b) => b.score - a.score);

    return Math.random() > 0.3 && columnScores.length > 1 && columnScores[1].score > 0 
      ? columnScores[1].column
      : columnScores[0].column
  }

  private minimax(board: Board, depth: number, maximizingPlayer: boolean): ScoreAndColumn {
    if (depth === 0) {
      const newScore: number = this.scoreBoard(board, Token.Enemy) - this.scoreBoard(board, Token.Player);
      // this.consoleLogData(board);
      return { column: null, score: newScore };
    }

    if (maximizingPlayer) {
      const value: ScoreAndColumn = { score: -Infinity, column: -200 };
      this.getValidColumns(board).forEach((column: number) => {
        const newBoard: Board = this.copy(board);
        const row: number = this.getValidRowInColumn(newBoard, column);
        newBoard[row][column] = Token.Enemy;
        const newValue: ScoreAndColumn = this.minimax(newBoard, depth - 1, false);
        if (newValue.score > value.score) {
          value.score = newValue.score;
          value.column = column;
        }
      });
      return value;
    } else if (!maximizingPlayer) {
      const value: ScoreAndColumn = { score: Infinity, column: -300 };
      this.getValidColumns(board).forEach((column: number) => {
        const newBoard: Board = this.copy(board);
        const row: number = this.getValidRowInColumn(newBoard, column);
        newBoard[row][column] = Token.Player;
        const newValue: ScoreAndColumn = this.minimax(newBoard, depth - 1, true);
        if (newValue.score < value.score) {
          value.score = newValue.score;
          value.column = column;
        }
      });
      return value;
    }
  }

  private scoreBoard(board: Board, token: Token): number {
    let score: number = 0;

    // score columns and rows
    for (let j = 0; j < this.height(board); j++) {
      for (let i = 0; i < this.width(board); i++) {
        if (board[j][i] === token) {
          score += this.getScoreForColumn(board, i);
          if (!this.firstMoveAI && token === Token.Player && (j % 2) || this.firstMoveAI && token === Token.Enemy && !(j % 2)) {
            score += Scores.oddEven;
          }
        }
      }
    }

    // points for windows
    score += this.scoreWindows(board, token, false);

    return score;
  }

  private copy(board: Board): Board {
    return board.map(r => [...r]);
  }

  private scoreMove(board: Board, column: number, token: Token): number {
    let score: number = 0;
    const row: number = this.getValidRowInColumn(board, column);
    if (row === null) {
      return -Infinity;
    }
    board[row][column] = token;
    // points for column
    score += this.getScoreForColumn(board, column);
    // points for odd/even row
    if (!this.firstMoveAI && ((this.height(board) - row - 1) % 2) || this.firstMoveAI && !(((this.height(board) - row - 1)) % 2)) {
      score += Scores.oddEven;
    }
    // points for windows
    score += this.scoreWindows(board, token);
    board[row][column] = Token.Empty;
    return score;
  }

  private getSetValue(set: string[], token: Token): number {
    let value: number = 0;
    const good: number = set.filter(s => s === token).length;
    const empty: number = set.filter(s => s === Token.Empty).length;

    if (good === 4) {
      value = Scores.win;
    } else if (good === 3 && empty === 1) {
      value = Scores.set3;
    } else if (good === 2 && empty === 2) {
      value = Scores.set2;
    }

    return value;
  }

  private getValidRowInColumn(board: Board, column: number): number {
    if (board[0][column] !== Token.Empty) {
      return null;
    }
    let row: number = this.height(board) - 1;
    while (board[row][column] !== Token.Empty) {
      row--;
    }
    return row;
  }

  private getValidColumns(board: Board): number[] {
    return board[0].reduce<number[]>((acc: number[], val: string, index: number) => {
      if (val === Token.Empty) {
        acc.push(index);
      }
      return acc;
    }, [] as number[]);
  }

  private getScoreForColumn(board: string[][], column: number): number {
    let score: number = 0;
    const centerColumn: number = Math.floor(this.width(board) / 2);
    score = Scores.column - Math.abs(column - centerColumn);
    return score;
  }

  private getOppToken(token: Token): Token {
    return token === Token.Enemy ? Token.Player : Token.Enemy;
  }

  private checkForEndCondition(board: Board): string {
    if (this.getValidColumns(board).length === 0) {
      return '_';
    }

    // points for horizontal sets
    for (let j = 0; j < this.height(board); j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        const test = [board[j][i], board[j][i + 1],
          board[j][i + 2], board[j][i + 3]];
        if (test.every(t => t === test[0] && t !== '_')) {
          return test[0];
        }
      }
    }

    // points for vertical sets
    for (let j = 0; j < this.height(board) - 3; j++) {
      for (let i = 0; i < this.width(board); i++) {
        const test = [board[j][i], board[j + 1][i],
          board[j + 2][i], board[j + 3][i]];
        if (test.every(t => t === test[0] && t !== '_')) {
          return test[0];
        }
      }
    }

    // points for diagonal down sets
    for (let j = 0; j < this.height(board) - 3; j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        const test = [board[j][i], board[j + 1][i + 1],
          board[j + 2][i + 2], board[j + 3][i + 3]];
        if (test.every(t => t === test[0] && t !== '_')) {
          return test[0];
        }
      }
    }

    // points for diagonal up sets
    for (let j = 3; j < this.height(board); j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        const test = [board[j][i], board[j - 1][i + 1],
          board[j - 2][i + 2], board[j - 3][i + 3]];
        if (test.every(t => t === test[0] && t !== '_')) {
          return test[0];
        }
      }
    }
    return null;
  }

  private scoreWindows(board: Board, token: Token, countOpponent: boolean = true): number {
    let score: number = 0;

    // points for horizontal sets
    for (let j = 0; j < this.height(board); j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        score += this.getSetValue([board[j][i], board[j][i + 1],
          board[j][i + 2], board[j][i + 3]], token);
        if (countOpponent) score -= this.getSetValue([board[j][i], board[j][i + 1],
          board[j][i + 2], board[j][i + 3]], this.getOppToken(token));
      }
    }

    // points for vertical sets
    for (let j = 0; j < this.height(board) - 3; j++) {
      for (let i = 0; i < this.width(board); i++) {
        score += this.getSetValue([board[j][i], board[j + 1][i],
          board[j + 2][i], board[j + 3][i]], token);
        if (countOpponent) score -= this.getSetValue([board[j][i], board[j + 1][i],
          board[j + 2][i], board[j + 3][i]], this.getOppToken(token));
      }
    }

    // points for diagonal down sets
    for (let j = 0; j < this.height(board) - 3; j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        score += this.getSetValue([board[j][i], board[j + 1][i + 1],
          board[j + 2][i + 2], board[j + 3][i + 3]], token);
        if (countOpponent) score -= this.getSetValue([board[j][i], board[j + 1][i + 1],
          board[j + 2][i + 2], board[j + 3][i + 3]], this.getOppToken(token));
      }
    }

    // points for diagonal up sets
    for (let j = 3; j < this.height(board); j++) {
      for (let i = 0; i < this.width(board) - 3; i++) {
        score += this.getSetValue([board[j][i], board[j - 1][i + 1],
          board[j - 2][i + 2], board[j - 3][i + 3]], token);
        if (countOpponent) score -= this.getSetValue([board[j][i], board[j - 1][i + 1],
          board[j - 2][i + 2], board[j - 3][i + 3]], this.getOppToken(token));
      }
    }

    return score;
  }

  public consoleLogData(board: Board): void {
    const cells: Board = board;
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