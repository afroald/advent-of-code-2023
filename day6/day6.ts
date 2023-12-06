import _ from 'lodash';

class Race {
  constructor(
    readonly duration: number,
    readonly recordDistance: number,
  ) {}
}

export function part1(input: string): number {
  const start = process.hrtime.bigint();

  function parseLine(input: string): number[] {
    const matches = input.match(/\d+/g);
    if (matches === null) {
      throw new Error('kapot');
    }
    return matches.map((value) => parseInt(value));
  }

  const races = (
    _.zip(...input.trim().split('\n').map(parseLine)) as [number, number][]
  ).map(([duration, distance]) => new Race(duration, distance));

  const possibleWinningOutcomes = races.map((race) => {
    const possibleOutcomes = [];
    for (let hold = 1; hold <= race.duration; hold++) {
      const distance = (race.duration - hold) * hold;
      possibleOutcomes.push(distance);
    }
    return possibleOutcomes.filter((distance) => distance > race.recordDistance)
      .length;
  });

  const result = possibleWinningOutcomes.reduce(
    (product, winningOutcomes) => product * winningOutcomes,
    1,
  );

  console.log(`duration: ${process.hrtime.bigint() - start}ns`);

  return result;
}

export function part2(input: string): number {
  const start = process.hrtime.bigint();

  function parseLine(input: string): number {
    const matches = input.match(/\d+/g);
    if (matches === null) {
      throw new Error('kapot');
    }
    return parseInt(matches.join(''));
  }

  const [duration, distance] = input.trim().split('\n').map(parseLine);
  const race = new Race(duration, distance);

  const possibleOutcomes = [];

  for (let hold = 1; hold <= race.duration; hold++) {
    const distance = (race.duration - hold) * hold;
    possibleOutcomes.push(distance);
  }

  const possibleWinningOutcomes = possibleOutcomes.filter(
    (distance) => distance > race.recordDistance,
  );

  console.log(`duration: ${process.hrtime.bigint() - start}ns`);

  return possibleWinningOutcomes.length;
}
