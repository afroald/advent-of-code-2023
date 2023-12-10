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

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Position(x: ${this.x}, y: ${this.y})`;
  }
}

enum Direction {
  Up,
  Left,
  Right,
  Down,
}

class Grid<T> {
  constructor(private readonly rows: T[][]) {}

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

export function figureOutPipeType(grid: Grid<string>, position: Position) {
  const checks = [
    ['|', '7', 'F'].includes(grid.get(position.above()) ?? 'non-existent'),
    ['-', 'L', 'F'].includes(grid.get(position.left()) ?? 'non-existent'),
    ['-', 'J', '7'].includes(grid.get(position.right()) ?? 'non-existent'),
    ['|', 'L', 'J'].includes(grid.get(position.below()) ?? 'non-existent'),
  ];

  function compare(a: boolean[], b: boolean[]) {
    return a.every((value, index) => value === b[index]);
  }

  switch (true) {
    case compare(checks, [true, false, false, true]):
      return '|';
    case compare(checks, [false, true, true, false]):
      return '-';
    case compare(checks, [true, false, true, false]):
      return 'L';
    case compare(checks, [true, true, false, false]):
      return 'J';
    case compare(checks, [false, true, false, true]):
      return '7';
    case compare(checks, [false, false, true, true]):
      return 'F';
    default:
      throw new Error('kapot');
  }
}

function findLoop(grid: Grid<string>): Position[] {
  const startingPosition = grid.find((value) => value === 'S');

  if (startingPosition === undefined) {
    throw new Error('Invalid input, no starting position');
  }

  const queue: Position[] = [startingPosition];
  const loop: Position[] = [];

  while (queue.length > 0) {
    const position = queue.shift() as Position;
    let object = grid.get(position);

    if (object === 'S') {
      object = figureOutPipeType(grid, position);
    }

    if (
      object === '.' ||
      loop.find((checked) => checked.equals(position)) !== undefined
    ) {
      continue;
    }

    switch (object) {
      case '|':
        queue.push(position.above(), position.below());
        break;
      case '-':
        queue.push(position.left(), position.right());
        break;
      case 'L':
        queue.push(position.above(), position.right());
        break;
      case 'J':
        queue.push(position.above(), position.left());
        break;
      case '7':
        queue.push(position.left(), position.below());
        break;
      case 'F':
        queue.push(position.right(), position.below());
        break;
      default:
        throw new Error('kapot');
    }

    loop.push(position);
  }

  return loop;
}

export function part1(input: string): number {
  const grid = parseInput(input);
  const loop = findLoop(grid);
  return loop.length / 2;
}

export function part2(input: string): number {
  const grid = parseInput(input);
  const loop = findLoop(grid);

  const zoomedGrid = new Grid<string>(
    new Array(grid.height * 3).fill('placeholder').map(() => {
      return new Array(grid.width * 3).fill('.');
    }),
  );

  for (const position of loop) {
    let object = grid.get(position);

    if (object === undefined) {
      continue;
    }

    if (object === 'S') {
      object = figureOutPipeType(grid, position);
    }

    const newPosition = new Position(position.x * 3, position.y * 3);
    const newValues: [Position, string][] = [
      [newPosition.above().left(), '_'],
      [newPosition.above(), '_'],
      [newPosition.above().right(), '_'],
      [newPosition.left(), '_'],
      [newPosition, object],
      [newPosition.right(), '_'],
      [newPosition.below().left(), '_'],
      [newPosition.below(), '_'],
      [newPosition.below().right(), '_'],
    ];

    switch (object) {
      case '|':
        newValues.push([newPosition.above(), '|'], [newPosition.below(), '|']);
        break;
      case '-':
        newValues.push([newPosition.left(), '-'], [newPosition.right(), '-']);
        break;
      case 'L':
        newValues.push([newPosition.above(), '|'], [newPosition.right(), '-']);
        break;
      case 'J':
        newValues.push([newPosition.above(), '|'], [newPosition.left(), '-']);
        break;
      case '7':
        newValues.push([newPosition.left(), '-'], [newPosition.below(), '|']);
        break;
      case 'F':
        newValues.push([newPosition.right(), '-'], [newPosition.below(), '|']);
        break;
    }

    for (const [position, value] of newValues) {
      try {
        zoomedGrid.set(position, value);
      } catch (error) {
        // don't care
      }
    }
  }

  // Expand the grid just to be sure we start flooding outside of the loop
  zoomedGrid.expand(Direction.Up, 1, '.');
  zoomedGrid.expand(Direction.Left, 1, '.');
  zoomedGrid.expand(Direction.Right, 1, '.');
  zoomedGrid.expand(Direction.Down, 1, '.');

  const queue: Position[] = [new Position(0, 0)];

  while (queue.length > 0) {
    const position = queue.shift() as Position;

    if (
      position.x < 0 ||
      position.x >= zoomedGrid.width ||
      position.y < 0 ||
      position.y >= zoomedGrid.height
    ) {
      continue;
    }

    const object = zoomedGrid.get(position);

    if (object === '.' || object === '_') {
      zoomedGrid.set(position, '0');
      queue.push(
        position.above(),
        position.left(),
        position.right(),
        position.below(),
      );
    }
  }

  const unmarkedPositions = zoomedGrid.filter((value) => value === '.');

  return unmarkedPositions.length / 9;
}
