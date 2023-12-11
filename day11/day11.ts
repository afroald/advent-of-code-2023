import { Position, parseInput } from '../grid.js';

export function part1(input: string): number {
  const grid = parseInput(input);

  const emptyColumns = [];

  for (let x = 0; x < grid.width; x++) {
    if (grid.getColumn(x).every((cell) => cell === '.')) {
      emptyColumns.push(x);
    }
  }

  for (const x of emptyColumns.reverse()) {
    grid.insertColumn(x, new Array(grid.height).fill('.'));
  }

  const emptyRows = [];

  for (let y = 0; y < grid.height; y++) {
    if (grid.getRow(y).every((cell) => cell === '.')) {
      emptyRows.push(y);
    }
  }

  for (const y of emptyRows.reverse()) {
    grid.insertRow(y, new Array(grid.width).fill('.'));
  }

  const galaxies = grid.filter((cell) => cell === '#');

  const pairs: [Position, Position][] = [];

  for (const [i, galaxy] of galaxies.entries()) {
    for (const other of galaxies.slice(i + 1)) {
      pairs.push([galaxy, other]);
    }
  }

  const distances = pairs.map(
    ([a, b]) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
  );

  return distances.reduce((sum, distance) => sum + distance, 0);
}

export function part2(input: string, expansionRatio = 1_000_000): number {
  const grid = parseInput(input);
  const galaxies = grid.filter((cell) => cell === '#');
  const emptyColumns = [];
  const emptyRows = [];

  for (let x = 0; x < grid.width; x++) {
    if (grid.getColumn(x).every((cell) => cell === '.')) {
      emptyColumns.push(x);
    }
  }

  for (let y = 0; y < grid.height; y++) {
    if (grid.getRow(y).every((cell) => cell === '.')) {
      emptyRows.push(y);
    }
  }

  for (const x of emptyColumns.reverse()) {
    const affectedGalaxies = galaxies.filter((position) => position.x >= x);

    for (const position of affectedGalaxies) {
      const index = galaxies.indexOf(position);
      galaxies.splice(
        index,
        1,
        new Position(position.x + expansionRatio - 1, position.y),
      );
    }
  }

  for (const y of emptyRows.reverse()) {
    const affectedGalaxies = galaxies.filter((position) => position.y >= y);

    for (const position of affectedGalaxies) {
      const index = galaxies.indexOf(position);
      galaxies.splice(
        index,
        1,
        new Position(position.x, position.y + expansionRatio - 1),
      );
    }
  }

  const pairs: [Position, Position][] = [];

  for (const [i, galaxy] of galaxies.entries()) {
    for (const other of galaxies.slice(i + 1)) {
      pairs.push([galaxy, other]);
    }
  }

  const distances = pairs.map(
    ([a, b]) => Math.abs(a.x - b.x) + Math.abs(a.y - b.y),
  );

  return distances.reduce((sum, distance) => sum + distance, 0);
}
