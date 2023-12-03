type Position = {
  x: number;
  y: number;
};

type Range = [Position, Position];

function rangeIncludes(range: Range, position: Position) {
  return (
    range[0].x <= position.x &&
    range[1].x >= position.x &&
    range[0].y <= position.y &&
    range[1].y >= position.y
  );
}

type PartNumber = {
  number: string;
  position: Position;
};

type Marker = {
  symbol: string;
  position: Position;
};

const onlySymbols = /(?![\d\.])./g;

const isNumber = (number: string) => !Number.isNaN(parseInt(number, 10));

function parseInput(input: string): [PartNumber[], Marker[]] {
  const partNumbers: PartNumber[] = [];
  const markers: Marker[] = [];

  for (const [y, line] of input.trim().split('\n').entries()) {
    let partNumber: PartNumber | null = null;

    for (let i = 0; i < line.length; i++) {
      if (isNumber(line[i])) {
        if (partNumber === null) {
          partNumber = {
            number: line[i],
            position: {
              x: i,
              y,
            },
          };
        } else {
          partNumber.number += line[i];
        }

        continue;
      }

      if (partNumber !== null) {
        partNumbers.push(partNumber);
        partNumber = null;
      }

      if (onlySymbols.test(line[i])) {
        markers.push({
          symbol: line[i],
          position: {
            x: i,
            y,
          },
        });

        continue;
      }
    }

    if (partNumber !== null) {
      partNumbers.push(partNumber);
    }
  }

  return [partNumbers, markers];
}

export function part1(input: string): number {
  const [partNumbers, markers] = parseInput(input);

  const validPartNumbers = partNumbers.filter((partNumber) => {
    const adjacentMarkersAbove = markers.filter(
      (marker) =>
        marker.position.x >= partNumber.position.x - 1 &&
        marker.position.x <= partNumber.position.x + partNumber.number.length &&
        marker.position.y === partNumber.position.y - 1,
    );
    const adjacentMarkersLeftAndRight = markers.filter(
      (marker) =>
        (marker.position.x === partNumber.position.x - 1 ||
          marker.position.x ===
            partNumber.position.x + partNumber.number.length) &&
        marker.position.y === partNumber.position.y,
    );
    const adjacentMarkersBelow = markers.filter(
      (marker) =>
        marker.position.x >= partNumber.position.x - 1 &&
        marker.position.x <= partNumber.position.x + partNumber.number.length &&
        marker.position.y === partNumber.position.y + 1,
    );

    return (
      [
        ...adjacentMarkersAbove,
        ...adjacentMarkersLeftAndRight,
        ...adjacentMarkersBelow,
      ].length > 0
    );
  });

  return validPartNumbers.reduce(
    (sum, partNumber) => sum + parseInt(partNumber.number, 10),
    0,
  );
}

type Gear = {
  position: Position;
  ratio: number;
};

export function part2(input: string): number {
  const [partNumbers, markers] = parseInput(input);

  const potentialGears = markers.filter((marker) => marker.symbol === '*');

  const gears: Gear[] = potentialGears.flatMap((gear): Gear[] => {
    const adjacentPositions: Position[] = [
      {
        x: gear.position.x - 1,
        y: gear.position.y - 1,
      },
      {
        x: gear.position.x,
        y: gear.position.y - 1,
      },
      {
        x: gear.position.x + 1,
        y: gear.position.y - 1,
      },
      {
        x: gear.position.x - 1,
        y: gear.position.y,
      },
      {
        x: gear.position.x + 1,
        y: gear.position.y,
      },
      {
        x: gear.position.x - 1,
        y: gear.position.y + 1,
      },
      {
        x: gear.position.x,
        y: gear.position.y + 1,
      },
      {
        x: gear.position.x + 1,
        y: gear.position.y + 1,
      },
    ];

    const adjacentPartNumbers = partNumbers.filter((partNumber) =>
      adjacentPositions.some((position) => {
        const range: Range = [
          partNumber.position,
          {
            x: partNumber.position.x + partNumber.number.length - 1,
            y: partNumber.position.y,
          },
        ];
        return rangeIncludes(range, position);
      }),
    );

    return adjacentPartNumbers.length === 2
      ? [
          {
            position: gear.position,
            ratio:
              parseInt(adjacentPartNumbers[0].number, 10) *
              parseInt(adjacentPartNumbers[1].number, 10),
          },
        ]
      : [];
  });

  return gears.reduce((sum, gear) => (sum += gear.ratio), 0);
}
