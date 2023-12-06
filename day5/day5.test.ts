import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FasterRangeMap, Range, RangeMap, part1, part2 } from './day5.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

describe('day5', () => {
  test(Range.name, () => {
    const [src, dst] = [new Range(98, 2), new Range(50, 2)];

    expect(src.includes(97)).toBe(false);
    expect(src.includes(98)).toBe(true);
    expect(src.includes(99)).toBe(true);
    expect(src.includes(100)).toBe(false);

    expect(dst.includes(49)).toBe(false);
    expect(dst.includes(50)).toBe(true);
    expect(dst.includes(51)).toBe(true);
    expect(dst.includes(52)).toBe(false);
  });

  test(Range.name, () => {
    const values = Array.from(new Range(1, 4));
    expect(values).toEqual([1, 2, 3, 4]);
  });

  test(RangeMap.name, () => {
    const map = new RangeMap([
      [new Range(98, 2), new Range(50, 2)],
      [new Range(50, 48), new Range(52, 48)],
    ]);

    expect(map.get(0)).toBe(0);
    expect(map.get(1)).toBe(1);
    expect(map.get(48)).toBe(48);
    expect(map.get(49)).toBe(49);
    expect(map.get(50)).toBe(52);
    expect(map.get(51)).toBe(53);
    expect(map.get(96)).toBe(98);
    expect(map.get(97)).toBe(99);
    expect(map.get(98)).toBe(50);
    expect(map.get(99)).toBe(51);
  });

  test(FasterRangeMap.name, () => {
    const map = new FasterRangeMap([
      [new Range(98, 2), new Range(50, 2)],
      [new Range(50, 48), new Range(52, 48)],
    ]);

    expect(map.get(0)).toBe(0);
    expect(map.get(1)).toBe(1);
    expect(map.get(48)).toBe(48);
    expect(map.get(49)).toBe(49);
    expect(map.get(50)).toBe(52);
    expect(map.get(51)).toBe(53);
    expect(map.get(96)).toBe(98);
    expect(map.get(97)).toBe(99);
    expect(map.get(98)).toBe(50);
    expect(map.get(99)).toBe(51);
  });

  test('part1', async () => {
    const exampleInput = await readFile(resolve(__dirname, 'example.txt'), {
      encoding: 'utf8',
    });
    expect(part1(exampleInput)).toBe(35);
  });

  test('part2', async () => {
    const exampleInput = await readFile(resolve(__dirname, 'example.txt'), {
      encoding: 'utf8',
    });
    expect(part2(exampleInput)).toBe(46);
  });
});
