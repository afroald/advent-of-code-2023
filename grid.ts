export class Position {
  constructor(
    readonly x: number,
    readonly y: number,
  ) {}

  above(): Position {
    return new Position(this.x, this.y - 1);
  }

  left(): Position {
    return new Position(this.x - 1, this.y);
  }

  right(): Position {
    return new Position(this.x + 1, this.y);
  }

  below(): Position {
    return new Position(this.x, this.y + 1);
  }

  equals(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  toString(): string {
    return `${this.x},${this.y}`;
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Position(x: ${this.x}, y: ${this.y})`;
  }
}

export enum Direction {
  Up = 'up',
  Left = 'left',
  Right = 'right',
  Down = 'down',
}

export enum Rotation {
  Clockwise,
  CounterClockwise,
}

export class Grid<T> {
  constructor(private rows: T[][]) {}

  get width(): number {
    return this.rows[0].length;
  }

  get height(): number {
    return this.rows.length;
  }

  isValidPosition(position: Position): boolean {
    return (
      position.x >= 0 &&
      position.x < this.width &&
      position.y >= 0 &&
      position.y < this.height
    );
  }

  get(position: Position): T | undefined {
    if (!this.isValidPosition(position)) {
      return;
    }

    return this.rows[position.y][position.x];
  }

  getRow(y: number): T[] {
    return this.rows[y];
  }

  getColumn(x: number): T[] {
    const column = [];

    for (let y = 0; y < this.height; y++) {
      column.push(this.rows[y][x]);
    }

    return column;
  }

  set(position: Position, value: T): void {
    if (!this.isValidPosition(position)) {
      throw new Error('invalid position');
    }

    this.rows[position.y][position.x] = value;
  }

  find(predicate: (value: T) => boolean): Position | undefined {
    for (let y = 0; y < this.rows.length; y++) {
      for (let x = 0; x < this.rows[y].length; x++) {
        if (predicate(this.rows[y][x])) {
          return new Position(x, y);
        }
      }
    }

    return undefined;
  }

  filter(predicate: (value: T) => boolean): Position[] {
    return this.rows.flatMap((row, y) =>
      row.flatMap((value, x) => (predicate(value) ? [new Position(x, y)] : [])),
    );
  }

  expand(direction: Direction, amount: number, value: T) {
    switch (direction) {
      case Direction.Up: {
        const newRows = new Array(amount)
          .fill('placeholder')
          .map(() => new Array(this.width).fill(value));
        this.rows.unshift(...newRows);
        break;
      }
      case Direction.Down: {
        const newRows = new Array(amount)
          .fill('placeholder')
          .map(() => new Array(this.width).fill(value));
        this.rows.push(...newRows);
        break;
      }
      case Direction.Left: {
        for (const row of this.rows) {
          const newValues = new Array(amount).fill(value);
          row.unshift(...newValues);
        }
        break;
      }
      case Direction.Right: {
        for (const row of this.rows) {
          const newValues = new Array(amount).fill(value);
          row.push(...newValues);
        }
        break;
      }
    }
  }

  insertRow(y: number, row: T[]) {
    if (row.length !== this.width) {
      throw new Error('Invalid row length');
    }

    this.rows.splice(y, 0, row);
  }

  insertColumn(x: number, column: T[]) {
    if (column.length !== this.height) {
      throw new Error('Invalid column length');
    }

    if (x < 0 || x >= this.width) {
      throw new Error('invalid position');
    }

    for (const [y, row] of this.rows.entries()) {
      row.splice(x, 0, column[y]);
    }
  }

  rotate(direction: Rotation) {
    switch (direction) {
      case Rotation.Clockwise:
        this.rows = this.rows[0].map((_, index) =>
          this.rows.map((row) => row[index]).reverse(),
        );
        break;
      case Rotation.CounterClockwise:
        this.rows = this.rows[0].map((_, index) =>
          this.rows.map((row) => row[row.length - 1 - index]),
        );
        break;
    }
  }

  clone(): Grid<T> {
    return new Grid(this.rows.map((row) => Array.from(row)));
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Grid(\n${this.rows
      .map((row) => `\t${row.join('')}`)
      .join('\n')}\n)`;
  }
}

export function parseInput(input: string): Grid<string> {
  return new Grid(
    input
      .trim()
      .split('\n')
      .map((line) => line.split('')),
  );
}
