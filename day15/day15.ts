import { $enum } from 'ts-enum-util';

function hash(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    hash += input.charCodeAt(i);
    hash = hash * 17;
    hash = hash % 256;
  }

  return hash;
}

enum Operation {
  Remove = '-',
  Add = '=',
}

class Instruction {
  readonly box: number;

  constructor(
    readonly label: string,
    readonly operation: Operation,
    readonly focalLength?: number,
  ) {
    this.box = hash(label);
  }

  static fromString(input: string): Instruction {
    const [, label, operation, focalLength] =
      input.match(/(.+)(-|=)(\d*)/) ?? [];

    if (!$enum(Operation).isValue(operation)) {
      throw new Error('invalid input');
    }

    return new Instruction(
      label,
      operation,
      focalLength !== '' ? parseInt(focalLength) : undefined,
    );
  }
}

class Box {
  lenses: Lens[] = [];

  removeLens(label: string) {
    const index = this.lenses.findIndex((lens) => lens.label === label);

    if (index === -1) {
      return;
    }

    this.lenses.splice(index, 1);
  }

  addLens(newLens: Lens) {
    const index = this.lenses.findIndex((lens) => lens.label === newLens.label);

    if (index === -1) {
      this.lenses.push(newLens);
      return;
    }

    this.lenses.splice(index, 1, newLens);
  }
}

class Lens {
  constructor(
    readonly focalLength: number,
    readonly label: string,
  ) {}
}

export function part1(input: string): number {
  const steps = input.trim().split(',');
  const hashes = steps.map((step) => hash(step));
  return hashes.reduce((sum, hash) => sum + hash, 0);
}

export function part2(input: string): number {
  const instructions = input
    .trim()
    .split(',')
    .map((instruction) => Instruction.fromString(instruction));
  const boxes = new Array(256).fill(null).map(() => new Box());

  for (const instruction of instructions) {
    const box = boxes[instruction.box];

    switch (instruction.operation) {
      case Operation.Remove:
        box.removeLens(instruction.label);
        break;
      case Operation.Add:
        if (instruction.focalLength === undefined) {
          throw new Error('invalid input');
        }
        box.addLens(new Lens(instruction.focalLength, instruction.label));
        break;
    }
  }

  return boxes.reduce(
    (sum, box, boxIndex) =>
      sum +
      box.lenses.reduce(
        (sum, lens, lensIndex) =>
          sum + (boxIndex + 1) * (lensIndex + 1) * lens.focalLength,
        0,
      ),
    0,
  );
}
