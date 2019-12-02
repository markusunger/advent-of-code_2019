const fs = require('fs');

const intcode = fs
  .readFileSync('input.txt', 'utf8')
  .split(',')
  .map(Number);

(function solutionPart1() {
  let ptr = 0;
  intcode[1] = 12;
  intcode[2] = 2;
  while (intcode[ptr] !== 99) {
    const v1 = intcode[intcode[ptr + 1]];
    const v2 = intcode[intcode[ptr + 2]];
    const tg = intcode[ptr + 3];
    if (intcode[ptr] === 1) intcode[tg] = v1 + v2;
    if (intcode[ptr] === 2) intcode[tg] = v1 * v2;
    ptr += 4;
  }
  console.log(intcode[0]);
}());
