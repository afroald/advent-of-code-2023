function calculateDifferences(input: number[]): number[] {
  let previousValue: number | null = null;

  return input.reduce((diff, value) => {
    if (previousValue === null) {
      previousValue = value;
      return diff;
    }
    const result = [...diff, value - previousValue];
    previousValue = value;
    return result;
  }, []);
}

export function part1(input: string): number {
  function predict(input: number[]): number[] {
    if (input.every((value) => value === 0)) {
      return [...input, 0];
    }

    const diff = calculateDifferences(input);
    const prediction = predict(diff);
    return [
      ...input,
      input[input.length - 1] + prediction[prediction.length - 1],
    ];
  }

  const histories = input
    .trim()
    .split('\n')
    .map((line) => line.split(' ').map((value) => parseInt(value)));

  const predictions = histories.map((history) => {
    const prediction = predict(history);
    return prediction[prediction.length - 1];
  });

  return predictions.reduce((sum, prediction) => sum + prediction, 0);
}

export function part2(input: string): number {
  function predict(input: number[]): number[] {
    if (input.every((value) => value === 0)) {
      return [0, ...input];
    }

    const diff = calculateDifferences(input);
    const prediction = predict(diff);
    return [input[0] - prediction[0], ...input];
  }

  const histories = input
    .trim()
    .split('\n')
    .map((line) => line.split(' ').map((value) => parseInt(value)));

  const predictions = histories.map((history) => {
    const prediction = predict(history);
    return prediction[0];
  });

  return predictions.reduce((sum, prediction) => sum + prediction, 0);
}
