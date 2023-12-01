export function part1(input: string): number {
  const lines = input.trim().split('\n');
  const calibrations = lines.map((line) => {
    const numbers = line
      .replaceAll(/\D/g, '')
      .split('')
      .map((value) => parseInt(value, 10));
    return numbers[0] * 10 + numbers[numbers.length - 1];
  });
  return calibrations.reduce((sum, value) => sum + value, 0);
}

const validSpelledOutNumbers = new Map([
  ['one', 1],
  ['two', 2],
  ['three', 3],
  ['four', 4],
  ['five', 5],
  ['six', 6],
  ['seven', 7],
  ['eight', 8],
  ['nine', 9],
]);

function stringToNumber(input: string): number {
  if (input.length === 1) {
    return parseInt(input, 10);
  }
  return validSpelledOutNumbers.get(input) as number;
}

function reverse(input: string): string {
  return input.split('').reverse().join('');
}

export function part2(input: string): number {
  const stringsToFind = [
    ...validSpelledOutNumbers.keys(),
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
  ];
  const lines = input.trim().split('\n');

  const calibrations = lines.map((line) => {
    const leftSearchMatches = stringsToFind
      .map((string) => [line.search(new RegExp(string)), string] as const)
      .filter(([index]) => index !== -1)
      .sort(([a], [b]) => a - b);

    const lineReversed = reverse(line);
    const rightSearchMatches = stringsToFind
      .map(
        (string) =>
          [lineReversed.search(new RegExp(reverse(string))), string] as const,
      )
      .filter(([index]) => index !== -1)
      .map(
        ([index, string]) =>
          [line.length - index - string.length, string] as const,
      )
      .sort(([a], [b]) => a - b);

    const firstNumber = stringToNumber(leftSearchMatches[0][1]);
    const lastNumber = stringToNumber(
      rightSearchMatches[rightSearchMatches.length - 1][1],
    );
    return firstNumber * 10 + lastNumber;
  });

  return calibrations.reduce((sum, value) => sum + value, 0);
}
