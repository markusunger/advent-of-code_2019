const fs = require('fs');

const input = fs
  .readFileSync('input.txt', 'utf8')
  .split(',')
  .map(Number);

function runCode(pr1, pr2) {
  const intcode = input.slice();
  let ptr = 0;
  intcode[1] = pr1;
  intcode[2] = pr2;
  while (intcode[ptr] !== 99) {
    const v1 = intcode[intcode[ptr + 1]];
    const v2 = intcode[intcode[ptr + 2]];
    const tg = intcode[ptr + 3];
    if (intcode[ptr] === 1) intcode[tg] = v1 + v2;
    if (intcode[ptr] === 2) intcode[tg] = v1 * v2;
    ptr += 4;
  }
  return intcode[0];
}

(function solutionPart1() {
  const solution = runCode(12, 2);
  console.log(solution);
}());

(function solutionPart2() {
  for (let pr1 = 0; pr1 <= 99; pr1 += 1) {
    for (let pr2 = 0; pr2 <= 99; pr2 += 1) {
      const solution = runCode(pr1, pr2);
      if (solution === 19690720) {
        console.log(100 * pr1 + pr2);
        process.exit();
      }
    }
  }
}());
