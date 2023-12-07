import { $enum } from 'ts-enum-util';

enum Suit {
  Ace = 'A',
  King = 'K',
  Queen = 'Q',
  Jack = 'J',
  Tiger = 'T',
  Nine = '9',
  Eight = '8',
  Seven = '7',
  Six = '6',
  Five = '5',
  Four = '4',
  Three = '3',
  Two = '2',
}

enum HandType {
  FiveOfAKind = 'five-of-a-kind',
  FourOfAKind = 'four-of-a-kind',
  FullHouse = 'full-house',
  ThreeOfAKind = 'three-of-a-kind',
  TwoPair = 'two-pair',
  OnePair = 'one-pair',
  HighCard = 'high-card',
}

class Hand {
  constructor(
    readonly cards: [Suit, Suit, Suit, Suit, Suit],
    readonly bid: number,
  ) {}

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Hand(cards: [${this.cards.join(', ')}], bid: ${this.bid})`;
  }

  static fromString(input: string): Hand {
    const [cards, bid] = input.trim().split(' ');
    return new Hand(
      cards.split('').map((card) => {
        if (!$enum(Suit).isValue(card)) {
          throw new Error('kapot');
        }
        return card;
      }) as [Suit, Suit, Suit, Suit, Suit],
      parseInt(bid),
    );
  }
}

export function part1(input: string): number {
  const rankedSuits = [
    Suit.Ace,
    Suit.King,
    Suit.Queen,
    Suit.Jack,
    Suit.Tiger,
    Suit.Nine,
    Suit.Eight,
    Suit.Seven,
    Suit.Six,
    Suit.Five,
    Suit.Four,
    Suit.Three,
    Suit.Two,
  ].reverse();

  const rankedHandTypes = [
    HandType.FiveOfAKind,
    HandType.FourOfAKind,
    HandType.FullHouse,
    HandType.ThreeOfAKind,
    HandType.TwoPair,
    HandType.OnePair,
    HandType.HighCard,
  ].reverse();

  function computeHandType(hand: Hand): HandType {
    const numberOfCardsPerSuit = new Map<Suit, number>();

    for (const suit of $enum(Suit).values()) {
      numberOfCardsPerSuit.set(suit, 0);
    }

    for (const suit of hand.cards) {
      numberOfCardsPerSuit.set(
        suit,
        (numberOfCardsPerSuit.get(suit) as number) + 1,
      );
    }

    const counts = Array.from(numberOfCardsPerSuit.values()).filter(
      (count) => count !== 0,
    );

    counts.sort((a, b) => b - a);

    switch (true) {
      case counts[0] === 5:
        return HandType.FiveOfAKind;
      case counts[0] === 4:
        return HandType.FourOfAKind;
      case counts[0] === 3 && counts[1] === 2:
        return HandType.FullHouse;
      case counts[0] === 3:
        return HandType.ThreeOfAKind;
      case counts[0] === 2 && counts[1] === 2:
        return HandType.TwoPair;
      case counts[0] === 2:
        return HandType.OnePair;
      case counts.every((count) => count === 1):
        return HandType.HighCard;
      default:
        throw new Error('kapot');
    }
  }

  function compare(a: Hand, b: Hand): number {
    const typeRankA = rankedHandTypes.indexOf(computeHandType(a));
    const typeRankB = rankedHandTypes.indexOf(computeHandType(b));

    if (typeRankA !== typeRankB) {
      return typeRankA - typeRankB;
    }

    for (let i = 0; i < 5; i++) {
      const cardRankA = rankedSuits.indexOf(a.cards[i]);
      const cardRankB = rankedSuits.indexOf(b.cards[i]);

      if (cardRankA === cardRankB) {
        continue;
      }

      return cardRankA - cardRankB;
    }

    return 0;
  }

  const hands = input
    .trim()
    .split('\n')
    .map((line) => Hand.fromString(line));

  hands.sort(compare);

  return Array.from(hands.entries()).reduce(
    (total, [i, hand]) => total + hand.bid * (i + 1),
    0,
  );
}

export function part2(input: string): number {
  const rankedSuits = [
    Suit.Ace,
    Suit.King,
    Suit.Queen,
    Suit.Tiger,
    Suit.Nine,
    Suit.Eight,
    Suit.Seven,
    Suit.Six,
    Suit.Five,
    Suit.Four,
    Suit.Three,
    Suit.Two,
    Suit.Jack,
  ].reverse();

  const rankedHandTypes = [
    HandType.FiveOfAKind,
    HandType.FourOfAKind,
    HandType.FullHouse,
    HandType.ThreeOfAKind,
    HandType.TwoPair,
    HandType.OnePair,
    HandType.HighCard,
  ].reverse();

  function computeHandType(hand: Hand): HandType {
    let numberOfJokers = 0;
    const numberOfCardsPerSuit = new Map<Suit, number>();

    for (const suit of $enum(Suit).values()) {
      numberOfCardsPerSuit.set(suit, 0);
    }

    for (const suit of hand.cards) {
      if (suit === Suit.Jack) {
        numberOfJokers++;
        continue;
      }

      numberOfCardsPerSuit.set(
        suit,
        (numberOfCardsPerSuit.get(suit) as number) + 1,
      );
    }

    const counts = Array.from(numberOfCardsPerSuit.values()).filter(
      (count) => count !== 0,
    );

    counts.sort((a, b) => b - a);

    switch (true) {
      case numberOfJokers === 5:
        return HandType.FiveOfAKind;
      case counts[0] === 5 - numberOfJokers:
        return HandType.FiveOfAKind;
      case counts[0] === 4 - numberOfJokers:
        return HandType.FourOfAKind;
      case (counts[0] === 3 && counts[1] === 2) ||
        (counts.length === 2 &&
          counts.every((count) => count === 2) &&
          numberOfJokers === 1):
        return HandType.FullHouse;
      case counts[0] === 3 - numberOfJokers:
        return HandType.ThreeOfAKind;
      case counts[0] === 2 && counts[1] === 2:
        return HandType.TwoPair;
      case counts[0] === 2 - numberOfJokers:
        return HandType.OnePair;
      case (counts.length === 5 && counts.every((count) => count === 1)) ||
        (counts.length === 4 &&
          counts.every((count) => count === 1) &&
          numberOfJokers === 1):
        return HandType.HighCard;
      default:
        console.log(hand, numberOfJokers, counts);
        throw new Error('kapot');
    }
  }

  function compare(a: Hand, b: Hand): number {
    const typeRankA = rankedHandTypes.indexOf(computeHandType(a));
    const typeRankB = rankedHandTypes.indexOf(computeHandType(b));

    if (typeRankA !== typeRankB) {
      return typeRankA - typeRankB;
    }

    for (let i = 0; i < 5; i++) {
      const cardRankA = rankedSuits.indexOf(a.cards[i]);
      const cardRankB = rankedSuits.indexOf(b.cards[i]);

      if (cardRankA === cardRankB) {
        continue;
      }

      return cardRankA - cardRankB;
    }

    return 0;
  }

  const hands = input
    .trim()
    .split('\n')
    .map((line) => Hand.fromString(line));

  hands.sort(compare);

  return Array.from(hands.entries()).reduce(
    (total, [i, hand]) => total + hand.bid * (i + 1),
    0,
  );
}
