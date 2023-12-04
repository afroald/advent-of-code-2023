const cardId = /Card +(\d+)/;

function parseCardId(input: string): number {
  const matches = input.match(cardId);

  if (matches === null) {
    throw new Error('kapot');
  }

  return parseInt(matches[1]);
}

function parseNumbers(input: string): number[] {
  return input
    .split(' ')
    .filter((x) => x !== '')
    .map((x) => parseInt(x));
}

class Card {
  readonly id: number;
  readonly winningNumbers: number[];
  readonly drawnNumbers: number[];

  constructor(line: string) {
    const [cardId, numbers] = line.split(':');
    this.id = parseCardId(cardId);

    const [winningNumbers, drawnNumbers] = numbers
      .split('|')
      .map((x) => x.trim());
    this.winningNumbers = parseNumbers(winningNumbers);
    this.drawnNumbers = parseNumbers(drawnNumbers);
  }

  get points() {
    const x = this.drawnNumbers.filter((number) =>
      this.winningNumbers.includes(number),
    );

    if (x.length === 0) {
      return 0;
    }

    return Math.pow(2, x.length - 1);
  }

  get numberOfWinningNumbers() {
    return this.drawnNumbers.filter((number) =>
      this.winningNumbers.includes(number),
    ).length;
  }
}

export function part1(input: string): number {
  const cards = input
    .trim()
    .split('\n')
    .map((line) => new Card(line));

  return cards.reduce((sum, card) => (sum += card.points), 0);
}

export function part2(input: string): number {
  const cards = input
    .trim()
    .split('\n')
    .map((line) => new Card(line))
    .reduce((map, card) => {
      map.set(card.id, card);
      return map;
    }, new Map());

  const queue: Card[] = Array.from(cards.values());
  const checked: Card[] = [];

  while (queue.length !== 0) {
    const card = queue.shift() as Card;

    for (let j = card.id + card.numberOfWinningNumbers; j > card.id; j--) {
      const card = cards.get(j);
      if (card === undefined) {
        continue;
      }
      queue.unshift(card);
    }

    checked.push(card);
  }

  return checked.length;
}
