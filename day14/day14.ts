import _ from 'lodash';
import { $enum } from 'ts-enum-util';
import { Grid, Position, Rotation } from '../grid.js';

enum Rock {
  Round = 'O',
  Square = '#',
  NonExistent = '.',
}

function tilt(grid: Grid<Rock>): void {
  const roundRocks = _.orderBy(
    grid.filter((rock) => rock === Rock.Round),
    ['y', 'x'],
  );

  for (const rock of roundRocks) {
    if (rock.y === 0) {
      continue;
    }

    const column = grid.getColumn(rock.x);

    const stepsUntilFirstObstacle = column
      .slice(0, rock.y)
      .reverse()
      .findIndex((rock) => rock === Rock.Round || rock === Rock.Square);

    if (stepsUntilFirstObstacle === 0) {
      continue;
    }

    const newY =
      stepsUntilFirstObstacle === -1 ? 0 : rock.y - stepsUntilFirstObstacle;

    grid.set(new Position(rock.x, newY), Rock.Round);
    grid.set(rock, Rock.NonExistent);
  }
}

export function part1(input: string): number {
  const grid = new Grid<Rock>(
    input
      .trim()
      .split('\n')
      .map((line) =>
        line.split('').filter((rock): rock is Rock => {
          if (!$enum(Rock).isValue(rock)) {
            throw new Error('invalid input');
          }
          return true;
        }),
      ),
  );

  tilt(grid);

  return grid
    .filter((rock) => rock === Rock.Round)
    .reduce((load, rock) => load + grid.height - rock.y, 0);
}

export function part2(input: string): number {
  const grid = new Grid<Rock>(
    input
      .trim()
      .split('\n')
      .map((line) =>
        line.split('').filter((rock): rock is Rock => {
          if (!$enum(Rock).isValue(rock)) {
            throw new Error('invalid input');
          }
          return true;
        }),
      ),
  );

  for (let i = 0; i < 1_000; i++) {
    tilt(grid);
    grid.rotate(Rotation.Clockwise);
    tilt(grid);
    grid.rotate(Rotation.Clockwise);
    tilt(grid);
    grid.rotate(Rotation.Clockwise);
    tilt(grid);
    grid.rotate(Rotation.Clockwise);
  }

  return grid
    .filter((rock) => rock === Rock.Round)
    .reduce((load, rock) => load + grid.height - rock.y, 0);
}
