import memoize from 'memoize';
import StatsMap from 'stats-map';
import { $enum } from 'ts-enum-util';

enum Spring {
  Operational = '.',
  Damaged = '#',
  Unknown = '?',
}

function parseLine(line: string): [Spring[], number[]] {
  const [springs, groups] = line.split(' ');
  return [
    springs
      .split('')
      .filter((value): value is Spring => $enum(Spring).isValue(value)),
    groups.split(',').map((group) => parseInt(group)),
  ] as const;
}

function countValidPossibilities(
  springs: Spring[],
  groups: number[],
  numDamaged = 0,
): number {
  switch (springs[0]) {
    case Spring.Unknown:
      return (
        memoized(
          [Spring.Operational, ...springs.slice(1)],
          groups,
          numDamaged,
        ) + memoized([Spring.Damaged, ...springs.slice(1)], groups, numDamaged)
      );

    case Spring.Operational:
      if (numDamaged === 0) {
        return memoized(springs.slice(1), groups);
      }
      if (groups.length === 0 || groups[0] !== numDamaged) {
        return 0;
      }
      return memoized(springs.slice(1), groups.slice(1));

    case Spring.Damaged:
      if (groups.length === 0 || numDamaged > groups[0]) {
        return 0;
      }
      return memoized(springs.slice(1), groups, numDamaged + 1);

    case undefined:
      if (groups.length === 0 && numDamaged === 0) {
        return 1;
      }
      if (groups.length === 1 && groups[0] === numDamaged) {
        return 1;
      }
      return 0;

    default:
      throw new Error('kapot');
  }
}

const cache = new StatsMap();
const memoized = memoize(countValidPossibilities, {
  cache,
  cacheKey(args) {
    return JSON.stringify(args);
  },
});

export function part1(input: string): number {
  const report = input
    .trim()
    .split('\n')
    .map((line) => parseLine(line));

  const sum = report.reduce(
    (sum, [springs, groups]) => sum + memoized(springs, groups),
    0,
  );

  console.log(cache.stats);

  return sum;
}

export function part2(input: string): number {
  const report = input
    .trim()
    .split('\n')
    .map((line) => {
      const [springs, groups] = line.split(' ');
      return `${new Array(5).fill(springs).join('?')} ${new Array(5)
        .fill(groups)
        .join(',')}`;
    })
    .map((line) => parseLine(line));

  const sum = report.reduce(
    (sum, [springs, groups]) => sum + memoized(springs, groups),
    0,
  );

  console.log(cache.stats);

  return sum;
}
