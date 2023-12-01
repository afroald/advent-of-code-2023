import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { part1, part2 } from './day1.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('day1', () => {
  test('part1', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part1-example.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part1(exampleInput)).toBe(142);
  });

  test('part2', async () => {
    const exampleInput = await readFile(
      resolve(__dirname, 'part2-example.txt'),
      {
        encoding: 'utf8',
      },
    );
    expect(part2(exampleInput)).toBe(281);
  });
});
