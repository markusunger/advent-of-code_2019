const fs = require('fs');

const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

const intcodeProcessor = {
  init: function init(input) {
    this.input = input;
    this.intcode = file.slice();
    this.ptr = 0;
    return this;
  },

  parse: function parse(instruction) {
    const instr = instruction.toString();
    const params = instr.slice(0, -2).split('').reverse().map(Number);
    if (!params[0]) params[0] = 0;
    if (!params[1]) params[1] = 0;
    if (!params[2]) params[2] = 0;
    return {
      string: instr,
      opcode: Number(instr.slice(-1)),
      params,
    };
  },

  execute: function execute(instr) {
    const ic = this.intcode;
    const { ptr } = this;
    switch (instr.opcode) {
      case 1: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        ic[ic[ptr + 3]] = a + b;
        return 4;
      }

      case 2: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        ic[ic[ptr + 3]] = a * b;
        return 4;
      }

      case 3: {
        ic[ic[ptr + 1]] = this.input;
        return 2;
      }

      case 4: {
        console.log(instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1]);
        return 2;
      }

      case 5: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        if (a !== 0) {
          this.ptr = b;
          return 0;
        }
        return 3;
      }

      case 6: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        if (a === 0) {
          this.ptr = b;
          return 0;
        }
        return 3;
      }

      case 7: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        if (a < b) ic[ic[ptr + 3]] = 1;
        else ic[ic[ptr + 3]] = 0;
        return 4;
      }

      case 8: {
        const a = instr.params[0] === 0 ? ic[ic[ptr + 1]] : ic[ptr + 1];
        const b = instr.params[1] === 0 ? ic[ic[ptr + 2]] : ic[ptr + 2];
        if (a === b) ic[ic[ptr + 3]] = 1;
        else ic[ic[ptr + 3]] = 0;
        return 4;
      }
      default:
        console.error('Invalid opcode');
        process.exit();
    }
    return 'reached unreachable code';
  },

  run: function run() {
    const ic = this.intcode;
    while (ic[this.ptr] !== 99) {
      const instr = this.parse(ic[this.ptr]);
      const steps = this.execute(instr);
      this.ptr += steps;
    }
  },
};

intcodeProcessor.init(1).run();
