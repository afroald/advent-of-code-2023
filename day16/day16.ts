import { Direction, Grid, Position } from '../grid.js';
import { $enum } from 'ts-enum-util';

enum CellContent {
  Empty = '.',
  MirrorA = '/',
  MirrorB = '\\',
  VerticalSplitter = '|',
  HorizontalSplitter = '-',
}

type LightRay = {
  position: Position;
  direction: Direction;
};

export function move(position: Position, direction: Direction): Position {
  switch (direction) {
    case Direction.Up:
      return new Position(position.x, position.y - 1);
    case Direction.Right:
      return new Position(position.x + 1, position.y);
    case Direction.Down:
      return new Position(position.x, position.y + 1);
    case Direction.Left:
      return new Position(position.x - 1, position.y);
  }
}

export const reflectionMap = {
  [Direction.Up]: {
    [CellContent.MirrorA]: Direction.Right,
    [CellContent.MirrorB]: Direction.Left,
  },
  [Direction.Right]: {
    [CellContent.MirrorA]: Direction.Up,
    [CellContent.MirrorB]: Direction.Down,
  },
  [Direction.Down]: {
    [CellContent.MirrorA]: Direction.Left,
    [CellContent.MirrorB]: Direction.Right,
  },
  [Direction.Left]: {
    [CellContent.MirrorA]: Direction.Down,
    [CellContent.MirrorB]: Direction.Up,
  },
};

export function reflect(
  mirror: CellContent.MirrorA | CellContent.MirrorB,
  rayDirection: Direction,
): Direction {
  return reflectionMap[rayDirection][mirror];
}

export function split(
  splitter: CellContent.HorizontalSplitter | CellContent.VerticalSplitter,
  rayDirection: Direction,
): Direction[] {
  switch (rayDirection) {
    case Direction.Up:
    case Direction.Down:
      if (splitter === CellContent.HorizontalSplitter) {
        return [Direction.Left, Direction.Right];
      } else {
        return [rayDirection];
      }
    case Direction.Left:
    case Direction.Right:
      if (splitter === CellContent.HorizontalSplitter) {
        return [rayDirection];
      } else {
        return [Direction.Up, Direction.Down];
      }
  }
}

function resolveLightRay(grid: Grid<CellContent>, ray: LightRay) {
  const queue: LightRay[] = [ray];
  const checked = new Set<string>();
  const energized = new Grid<string>(
    new Array(grid.height)
      .fill(null)
      .map(() => new Array(grid.width).fill(CellContent.Empty)),
  );

  while (queue.length > 0) {
    const ray = queue.shift();

    if (ray === undefined) {
      break;
    }

    if (checked.has(JSON.stringify(ray))) {
      continue;
    }

    const newPosition = move(ray.position, ray.direction);
    const object = grid.get(newPosition);

    switch (object) {
      case CellContent.Empty:
        energized.set(newPosition, '#');
        queue.push({ position: newPosition, direction: ray.direction });
        break;
      case CellContent.MirrorA:
      case CellContent.MirrorB:
        energized.set(newPosition, '#');
        const newDirection = reflect(object, ray.direction);
        queue.push({ position: newPosition, direction: newDirection });
        break;
      case CellContent.VerticalSplitter:
      case CellContent.HorizontalSplitter:
        energized.set(newPosition, '#');
        const newDirections = split(object, ray.direction);
        for (const direction of newDirections) {
          queue.push({ position: newPosition, direction });
        }
        break;
      case undefined:
      // We've gone outside the grid, just ignore because the ray would end here
    }

    checked.add(JSON.stringify(ray));
  }

  return energized.filter((value) => value === '#');
}

export function part1(input: string): number {
  const grid = new Grid(
    input
      .trim()
      .split('\n')
      .map((line) =>
        line.split('').map((cell) => {
          if (!$enum(CellContent).isValue(cell)) {
            throw new Error('invalid input');
          }
          return cell;
        }),
      ),
  );

  const energizedPositions = resolveLightRay(grid, {
    position: new Position(-1, 0),
    direction: Direction.Right,
  });

  return energizedPositions.length;
}

export function part2(input: string): number {
  const grid = new Grid(
    input
      .trim()
      .split('\n')
      .map((line) =>
        line.split('').map((cell) => {
          if (!$enum(CellContent).isValue(cell)) {
            throw new Error('invalid input');
          }
          return cell;
        }),
      ),
  );

  const rays: LightRay[] = [];

  for (let y = 0; y < grid.height; y++) {
    rays.push({
      position: new Position(-1, y),
      direction: Direction.Right,
    });
    rays.push({
      position: new Position(grid.width, y),
      direction: Direction.Left,
    });
  }

  for (let x = 0; x < grid.width; x++) {
    rays.push({
      position: new Position(x, -1),
      direction: Direction.Down,
    });
    rays.push({
      position: new Position(x, grid.height),
      direction: Direction.Up,
    });
  }

  return Math.max(
    ...rays.map((ray) => resolveLightRay(grid.clone(), ray).length),
  );
}
