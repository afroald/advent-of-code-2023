import meow from 'meow';
import { readdir, readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import pMap from 'p-map';
import prettyMilliseconds from 'pretty-ms';

const __dirname = dirname(fileURLToPath(import.meta.url));

async function findDays(): Promise<string[]> {
  const isValid = /day\d+/;
  const dirs = await readdir(resolve(__dirname));
  return dirs.filter((dir) => isValid.test(dir)).sort();
}

const cli = meow(
  `
  Usage
    $ solve [day]
`,
  {
    importMeta: import.meta,
  },
);

const day = cli.input[0];

const days = day ? [day] : await findDays();

type Report = {
  day: string;
  part: number;
  result: number;
  duration: bigint;
};

const reports = (
  await pMap(
    days,
    async (day) => {
      const reports: Report[] = [];

      const solver = await import(resolve(__dirname, day, `${day}.ts`));
      const input = await readFile(resolve(__dirname, day, 'input.txt'), {
        encoding: 'utf8',
      });

      if (solver.part1) {
        console.log(`Solving ${day} part1`);
        const start = process.hrtime.bigint();
        reports.push({
          day,
          part: 1,
          result: await solver.part1(input),
          duration: process.hrtime.bigint() - start,
        });
      }

      if (solver.part2) {
        console.log(`Solving ${day} part2`);
        const start = process.hrtime.bigint();
        reports.push({
          day,
          part: 2,
          result: await solver.part2(input),
          duration: process.hrtime.bigint() - start,
        });
      }

      return reports;
    },
    { concurrency: 1 },
  )
).flat();

for (const report of reports) {
  console.log(
    `Solved ${report.day} part${report.part} (${prettyMilliseconds(
      Number(report.duration) / 1000000,
    )}): ${report.result}`,
  );
}
