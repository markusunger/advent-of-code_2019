const fs = require('fs');

// const input = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);
const input = [1002, 4, 3, 4, 33];

function runCode(input) {
  let intcode = input.slice();
  let pointer = 0;
  let output = [];

  while (intcode[pointer] !== 99) { // until halt opcode
    let pointerJump = 0;
    let paramModes = [];

    const instrArr = intcode[pointer].split('').reverse();


    switch (opcode) {
      case '1':
        break;
    }
  }
}

(function solutionPart1() {
  runCode(1);
}());
