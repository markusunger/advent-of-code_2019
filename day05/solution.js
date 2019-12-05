const fs = require('fs');

// const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);
// const file = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
//   1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
//   999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
// const file = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
const file = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

const icComputer = {
  init: function init(input, intcode) {
    this.input = input;
    this.intcode = intcode;
    this.ptr = 0;
    return this;
  },

  parseInstruction: function parseInstruction(instr) {
    const iObj = {};
    const digits = String(instr).split('').reverse();
    digits.forEach((d, idx) => {
      if (idx === 0) {
        iObj.opcode = Number(d);
      } else if (idx > 1) {
        iObj[`pmode${idx - 1}`] = Number(d);
      }
    });
    return iObj;
  },

  getParamsTarget(instr) {
    let v1;
    let v2;
    if (!instr.pmode1) {
      v1 = this.intcode[this.intcode[this.ptr + 1]];
    } else {
      v1 = this.intcode[this.ptr + 1];
    }
    if (!instr.pmode2) {
      v2 = this.intcode[this.intcode[this.ptr + 2]];
    } else {
      v2 = this.intcode[this.ptr + 2];
    }
    const tg = this.intcode[this.ptr + 3];
    return [v1, v2, tg];
  },

  runInstruction: function runInstruction(instr) {
    switch (instr.opcode) {
      case 1: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        this.intcode[tg] = v1 + v2;
        console.log(`write ${v1} + ${v2} to [${tg}]`);
        return 4;
      }
      case 2: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        this.intcode[tg] = v1 * v2;
        console.log(`write ${v1} + ${v2} to [${tg}]`);
        return 4;
      }
      case 3: {
        this.intcode[this.intcode[this.ptr + 1]] = this.input;
        console.log(`write input ${this.input} to [${this.intcode[this.ptr + 1]}]`);
        return 2;
      }
      case 4: {
        console.log(`output [${this.intcode[this.ptr + 1]}] -> ${this.intcode[this.intcode[this.ptr + 1]]}`);
        return 2;
      }
      case 5: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 !== 0) {
          console.log(`pointer to ${v2}`);
          this.ptr = v2;
          return 0;
        }
        console.log('pointer not moved ...');
        return 3;
      }
      case 6: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 === 0) {
          console.log(`pointer to [${this.intcode[this.ptr + 2]}]`);
          if (!instr.pmode1) this.ptr = this.intcode[this.intcode[this.ptr + 2]];
          else this.ptr = this.intcode[this.ptr + 2];
          return 0;
        }
        console.log('pointer not moved ...');
        return 3;
      }
      case 7: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 < v2) {
          console.log(`write 1 to [${tg}]`);
          this.intcode[tg] = 1;
        } else {
          console.log(`write 0 to [${tg}]`);
          this.intcode[tg] = 0;
        }
        return 4;
      }
      case 8: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 === v2) {
          console.log(`write 1 to [${tg}]`);
          this.intcode[tg] = 1;
        } else {
          console.log(`write 0 to [${tg}]`);
          this.intcode[tg] = 0;
        }
        return 4;
      }
      default:
        return 1;
    }
  },

  run: function run() {
    while (this.intcode[this.ptr] !== 99) {
      const instruction = this.parseInstruction(this.intcode[this.ptr]);
      const steps = this.runInstruction(instruction);

      // debug
      if (Number.isNaN(instruction.opcode)) {
        console.log(this.intcode);
        process.exit();
      }
      console.log(`opcode: ${instruction.opcode}, pmode1: ${instruction.pmode1}, pmode2: ${instruction.pmode2}, pointer: [${this.ptr}] = ${this.intcode[this.ptr]}, steps: ${steps}`);

      this.ptr += steps;
    }
  },
};

// icComputer.init(1, file).run();
icComputer.init(0, file).run();
