import divisor from 'divisor';
import { $enum } from 'ts-enum-util';

enum Instruction {
  Left = 'L',
  Right = 'R',
}

const isInstruction = (instruction: string): instruction is Instruction =>
  $enum(Instruction).isValue(instruction);

class Node {
  constructor(
    readonly id: string,
    readonly left: string,
    readonly right: string,
  ) {}

  [Symbol.for('nodejs.util.inspect.custom')]() {
    return `Node(id: ${this.id}, left: ${this.left}, right: ${this.right})`;
  }

  static fromString(string: string) {
    const node = /([A-Z\d]+) = \(([A-Z\d]+), ([A-Z\d]+)\)/;
    const [, id, left, right] = string.match(node) ?? [];
    if (id === undefined || left === undefined || right === undefined) {
      throw new Error('kapot');
    }
    return new Node(id, left, right);
  }
}

class Network {
  readonly nodesById = new Map<string, Node>();

  constructor(readonly nodes: Node[]) {
    for (const node of nodes) {
      this.nodesById.set(node.id, node);
    }
  }

  get start() {
    const node = this.nodesById.get('AAA');

    if (node === undefined) {
      throw new Error('kapot');
    }

    return node;
  }

  get end() {
    const node = this.nodesById.get('ZZZ');

    if (node === undefined) {
      throw new Error('kapot');
    }

    return node;
  }
}

function parseInput(input: string): [Instruction[], Network] {
  const [instructionString, , ...nodeStrings] = input.trim().split('\n');
  const instructions = instructionString.split('');

  if (!instructions.every(isInstruction)) {
    throw new Error('kapot');
  }

  const nodes = nodeStrings.map((node) => Node.fromString(node));

  return [instructions, new Network(nodes)];
}

export function part1(input: string): number {
  const [instructions, network] = parseInput(input);

  let position = 'AAA';
  let steps = 1;

  while (position !== 'ZZZ') {
    for (const step of instructions) {
      const node = network.nodesById.get(position);
      if (node === undefined) {
        throw new Error('kapot');
      }
      switch (step) {
        case Instruction.Left:
          position = node.left;
          break;
        case Instruction.Right:
          position = node.right;
          break;
      }
      if (position === 'ZZZ') {
        break;
      }
      steps++;
    }
  }

  return steps;
}

export function part2(input: string): number {
  const [instructions, network] = parseInput(input);

  const positions = network.nodes
    .filter((node) => node.id.endsWith('A'))
    .map((node) => node.id);

  const stepsPerPosition = positions.map((position) => {
    let steps = 1;

    while (!position.endsWith('Z')) {
      for (const step of instructions) {
        const node = network.nodesById.get(position);
        if (node === undefined) {
          throw new Error('kapot');
        }
        switch (step) {
          case Instruction.Left:
            position = node.left;
            break;
          case Instruction.Right:
            position = node.right;
            break;
        }
        if (position.endsWith('Z')) {
          break;
        }
        steps++;
      }
    }

    return steps;
  });

  return stepsPerPosition.reduce((lcm, steps) =>
    divisor.leastCommonMultiple(lcm, steps),
  );
}
