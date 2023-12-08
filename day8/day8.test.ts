import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { part1, part2 } from './day8.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('day8', () => {
  test('part1', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'example1-part1.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part1(exampleInput)).toBe(2);
  });

  test('part1', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'example2-part1.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part1(exampleInput)).toBe(6);
  });

  test('part2', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'example-part2.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part2(exampleInput)).toBe(6);
  });
});
