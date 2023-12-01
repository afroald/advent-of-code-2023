import meow from 'meow';
import { readFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const cli = meow(
  `
  Usage
    $ solve <day>
`,
  {
    importMeta: import.meta,
  },
);

const day = cli.input[0];

if (typeof day !== 'string') {
  throw new Error('welke dag maat?');
}

const __dirname = dirname(fileURLToPath(import.meta.url));

const solver = await import(resolve(__dirname, day, `${day}.ts`));
const input = await readFile(resolve(__dirname, day, 'input.txt'), {
  encoding: 'utf8',
});

if (solver.part1) {
  console.log(`Part 1: ${await solver.part1(input)}`);
}

if (solver.part2) {
  console.log(`Part 2: ${await solver.part2(input)}`);
}
