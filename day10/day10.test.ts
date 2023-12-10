import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import {
  Position,
  parseInput,
  figureOutPipeType,
  part1,
  part2,
} from './day10.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('day10', () => {
  describe('figureOutPipeType', () => {
    test('|', () => {
      const grid = parseInput(`
.|.
.S.
.|.`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('|');
    });

    test('-', () => {
      const grid = parseInput(`
...
-S-
...`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('-');
    });

    test('L', () => {
      const grid = parseInput(`
.|.
.S-
...`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('L');
    });

    test('J', () => {
      const grid = parseInput(`
.|.
-S.
...`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('J');
    });

    test('7', () => {
      const grid = parseInput(`
...
-S.
.|.`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('7');
    });

    test('F', () => {
      const grid = parseInput(`
...
.S-
.|.`);
      expect(figureOutPipeType(grid, new Position(1, 1))).toBe('F');
    });
  });

  test('part1', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part1-example1.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part1(exampleInput)).toBe(4);
  });

  test('part1', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part1-example2.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part1(exampleInput)).toBe(8);
  });

  test('part2', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part2-example1.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part2(exampleInput)).toBe(4);
  });

  test('part2', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part2-example2.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part2(exampleInput)).toBe(8);
  });

  test('part2', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part2-example3.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part2(exampleInput)).toBe(10);
  });
});
