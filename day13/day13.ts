import { Grid } from '../grid.js';

function sum(values: number[]): number {
  return values.reduce((sum, value) => sum + value, 0);
}

export function part1(input: string): number {
  const patterns = input
    .trim()
    .split('\n\n')
    .map(
      (pattern) => new Grid(pattern.split('\n').map((line) => line.split(''))),
    );

  function findMirrorPoint(rows: string[]): number | undefined {
    for (let i = 1; i < rows.length; i++) {
      const a = rows.slice(0, i).reverse();
      const b = rows.slice(i);

      if (a.length <= b.length) {
        if (a.every((row, index) => row === b[index])) {
          return a.length - 1;
        }
      } else {
        if (b.every((row, index) => row === a[index])) {
          return a.length - 1;
        }
      }
    }

    return;
  }

  const vertical: number[] = [];
  const horizontal: number[] = [];

  for (const pattern of patterns) {
    const columns: string[] = [];
    for (let x = 0; x < pattern.width; x++) {
      columns.push(pattern.getColumn(x).join(''));
    }

    const verticalMirrorPoint = findMirrorPoint(columns);

    if (verticalMirrorPoint !== undefined) {
      vertical.push(verticalMirrorPoint + 1);
    }

    const rows: string[] = [];

    for (let y = 0; y < pattern.height; y++) {
      rows.push(pattern.getRow(y).join(''));
    }

    const horizontalMirrorPoint = findMirrorPoint(rows);

    if (horizontalMirrorPoint !== undefined) {
      horizontal.push(horizontalMirrorPoint + 1);
    }
  }

  return sum(horizontal) * 100 + sum(vertical);
}

function diff(a: string, b: string): number {
  let numberOfDifferentCharacters = 0;

  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) {
      numberOfDifferentCharacters++;
    }
  }

  return numberOfDifferentCharacters;
}

export function part2(input: string): number {
  const patterns = input
    .trim()
    .split('\n\n')
    .map(
      (pattern) => new Grid(pattern.split('\n').map((line) => line.split(''))),
    );

  function findMirrorPoint(rows: string[]): number | undefined {
    for (let i = 1; i < rows.length; i++) {
      const a = rows.slice(0, i).reverse();
      const b = rows.slice(i);

      if (a.length <= b.length) {
        const rowDiffs = a.map((row, index) => diff(row, b[index]));
        rowDiffs.sort((a, b) => b - a);
        if (
          rowDiffs[0] === 1 &&
          rowDiffs.slice(1).every((diff) => diff === 0)
        ) {
          return a.length;
        }
      } else {
        const rowDiffs = b.map((row, index) => diff(row, a[index]));
        rowDiffs.sort((a, b) => b - a);
        if (
          rowDiffs[0] === 1 &&
          rowDiffs.slice(1).every((diff) => diff === 0)
        ) {
          return a.length;
        }
      }
    }

    return;
  }

  const vertical: number[] = [];
  const horizontal: number[] = [];

  for (const pattern of patterns) {
    const columns: string[] = [];
    for (let x = 0; x < pattern.width; x++) {
      columns.push(pattern.getColumn(x).join(''));
    }

    const verticalMirrorPoint = findMirrorPoint(columns);

    if (verticalMirrorPoint !== undefined) {
      vertical.push(verticalMirrorPoint);
    }

    const rows: string[] = [];

    for (let y = 0; y < pattern.height; y++) {
      rows.push(pattern.getRow(y).join(''));
    }

    const horizontalMirrorPoint = findMirrorPoint(rows);

    if (horizontalMirrorPoint !== undefined) {
      horizontal.push(horizontalMirrorPoint);
    }
  }

  return sum(horizontal) * 100 + sum(vertical);
}
