import _ from 'lodash';

export class Range {
  constructor(
    readonly start: number,
    readonly length: number,
  ) {}

  includes(value: number) {
    return value >= this.start && value <= this.start + this.length - 1;
  }

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Range(start: ${this.start}, length: ${this.length})`;
  }

  *[Symbol.iterator]() {
    for (let i = this.start; i < this.start + this.length; i++) {
      yield i;
    }
  }
}

export class RangeMap {
  constructor(readonly ranges: [Range, Range][]) {}

  get(key: number): number {
    const [src, dst] = this.ranges.find(([range]) => range.includes(key)) ?? [];

    if (!src || !dst) {
      return key;
    }

    return dst.start + key - src.start;
  }
}

export class FasterRangeMap {
  readonly map = new Map<number, number>();

  constructor(ranges: [Range, Range][]) {
    ranges.forEach(([src, dst]) => {
      for (const value of src) {
        this.map.set(value, dst.start + value - src.start);
      }
    });
  }

  get(key: number) {
    const value = this.map.get(key);
    if (value === undefined) {
      return key;
    }
    return value;
  }
}

function parseSection(section: string): number[][] {
  const [, numbers] = section.split(':');
  const lines = numbers.trim().split('\n');
  return lines.map((line) =>
    line
      .trim()
      .split(' ')
      .map((value) => parseInt(value)),
  );
}

export function part1(input: string): number {
  const sections = input.trim().split('\n\n');
  const [[seeds], ...maps] = sections.map(parseSection);

  const [
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  ] = maps.map(
    (entries) =>
      new RangeMap(
        entries.map(
          (entry) =>
            [
              new Range(entry[1], entry[2]),
              new Range(entry[0], entry[2]),
            ] as const,
        ),
      ),
  );

  const locations = seeds.map(
    (seed) =>
      [
        seed,
        humidityToLocation.get(
          temperatureToHumidity.get(
            lightToTemperature.get(
              waterToLight.get(
                fertilizerToWater.get(
                  soilToFertilizer.get(seedToSoil.get(seed)),
                ),
              ),
            ),
          ),
        ),
      ] as const,
  );

  return Math.min(...locations.map(([, location]) => location));
}

export function part2(input: string): number {
  const sections = input.trim().split('\n\n');
  const seedRanges = parseSection(sections[0]).flatMap((seeds) =>
    _.chunk(seeds, 2).map(([start, length]) => new Range(start, length)),
  );

  const maps = sections.slice(1).map(parseSection);

  const [
    seedToSoil,
    soilToFertilizer,
    fertilizerToWater,
    waterToLight,
    lightToTemperature,
    temperatureToHumidity,
    humidityToLocation,
  ] = maps.map(
    (entries) =>
      new RangeMap(
        entries.map(
          (entry) =>
            [
              new Range(entry[1], entry[2]),
              new Range(entry[0], entry[2]),
            ] as const,
        ),
      ),
  );

  let smallestLocation = Infinity;
  const numberOfSeedsToCheck = seedRanges.reduce(
    (sum, range) => (sum += range.length),
    0,
  );
  let numberOfSeedsChecked = 0;

  for (const seedRange of seedRanges) {
    for (const seed of seedRange) {
      const location = humidityToLocation.get(
        temperatureToHumidity.get(
          lightToTemperature.get(
            waterToLight.get(
              fertilizerToWater.get(soilToFertilizer.get(seedToSoil.get(seed))),
            ),
          ),
        ),
      );

      numberOfSeedsChecked++;

      if (numberOfSeedsChecked % 100000 === 0) {
        console.log(
          `checked ${numberOfSeedsChecked} of ${numberOfSeedsToCheck} (${
            (numberOfSeedsChecked / numberOfSeedsToCheck) * 100
          }%)`,
        );
      }

      if (location < smallestLocation) {
        console.log('found smaller location:', location);
        smallestLocation = location;
      }
    }
  }

  return smallestLocation;
}
