function parseGameId(gameId: string) {
  const matches = gameId.match(/Game (\d+)/);

  if (matches === null) {
    throw new Error('kapot');
  }

  return parseInt(matches[1]);
}

class Set {
  readonly red: number = 0;
  readonly green: number = 0;
  readonly blue: number = 0;

  constructor(input: string) {
    for (const color of input.split(',')) {
      const matches = color.match(/(\d+) ([a-z]+)/);

      if (matches === null) {
        throw new Error('kapot');
      }

      switch (matches[2]) {
        case 'red':
          this.red = parseInt(matches[1]);
          break;
        case 'green':
          this.green = parseInt(matches[1]);
          break;
        case 'blue':
          this.blue = parseInt(matches[1]);
          break;
        default:
          throw new Error('kapot');
      }
    }
  }
}

class Game {
  readonly id: number;
  readonly sets: Set[];

  constructor(input: string) {
    const [gameId, sets] = input.split(':');
    this.id = parseGameId(gameId);

    this.sets = sets
      .trim()
      .split(';')
      .map((set) => new Set(set.trim()));
  }
}

export function part1(input: string): number {
  const numberOfRedCubes = 12;
  const numberOfGreenCubes = 13;
  const numberOfBlueCubes = 14;

  const lines = input.trim().split('\n');
  let result = 0;

  for (const line of lines) {
    const game = new Game(line);
    const gameIsPossible =
      game.sets.every((set) => set.red <= numberOfRedCubes) &&
      game.sets.every((set) => set.green <= numberOfGreenCubes) &&
      game.sets.every((set) => set.blue <= numberOfBlueCubes);

    if (gameIsPossible) {
      result += game.id;
    }
  }

  return result;
}

export function part2(input: string): number {
  const lines = input.trim().split('\n');

  let result = 0;

  for (const line of lines) {
    const game = new Game(line);
    const minRed = Math.max(...game.sets.map((set) => set.red));
    const minGreen = Math.max(...game.sets.map((set) => set.green));
    const minBlue = Math.max(...game.sets.map((set) => set.blue));

    result += minRed * minGreen * minBlue;
  }

  return result;
}
