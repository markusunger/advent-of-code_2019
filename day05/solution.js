const fs = require('fs');

// const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);
const file = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
  1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
  999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];
// const file = [3, 12, 6, 12, 15, 1, 13, 14, 13, 4, 13, 99, -1, 0, 1, 9];
// const file = [3, 3, 1105, -1, 9, 1101, 0, 0, 12, 4, 12, 99, 1];

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

  debugOutput: function debugOuput(instr) {
    let out = `${instr.opcode}: `;
    if (instr.opcode === 1 || instr.opcode === 2) {
      out += 'WRT ';
      out += instr.pmode1 ? `${this.intcode[this.ptr + 1]}` : `[${this.intcode[this.intcode[this.ptr + 1]]}]`;
      out += instr.opcode === 1 ? ' + ' : ' * ';
      out += instr.pmode2 ? ` ${this.intcode[this.ptr + 2]}` : ` [${this.intcode[this.intcode[this.ptr + 2]]}]`;
      out += ` TO [${this.intcode[this.ptr + 3]}]`;
    } else if (instr.opcode === 3) {
      out += `WRT ${this.input} TO [${this.intcode[this.ptr + 1]}]`;
    } else if (instr.opcode === 4) {
      out += `REA [${this.intcode[this.ptr + 1]}] -> ${this.intcode[this.intcode[this.ptr + 1]]}`;
    } else if (instr.opcode === 5 || instr.opcode === 6) {
      out += 'JMP IF ';
      out += instr.pmode1 ? `${this.intcode[this.ptr + 1]}` : `[${this.intcode[this.intcode[this.ptr + 1]]}]`;
      out += instr.opcode === 5 ? ' NOT 0 ' : ' IS 0 ';
    } else if (instr.opcode === 7 || instr.opcode === 8) {
      out += 'CMP ';
      out += instr.pmode1 ? `${this.intcode[this.ptr + 1]}` : `[${this.intcode[this.intcode[this.ptr + 1]]}]`;
      out += ' & ';
      out += instr.pmode2 ? `${this.intcode[this.ptr + 2]}` : `[${this.intcode[this.intcode[this.ptr + 2]]}]`;
      out += instr.opcode === 7 ? ' LESS THAN? -> 1 ELSE 0 TO ' : ' EQUAL? -> 1 ELSE 0 TO ';
      out += `[${this.intcode[this.ptr + 3]}]`;
    }
    console.log(out);
  },

  getParamsTarget: function getParamsTarget(instr) {
    let v1;
    let v2;
    if (!instr.pmode1) {
      v1 = this.intcode[this.intcode[this.ptr + 1]];
    } else {
      v1 = this.intcode[this.ptr + 1];
    }
    if (!instr.pmode2 || !instr.opcode === 5 || !instr.opcode === 6) {
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
        this.debugOuput(instr);
        return 4;
      }
      case 2: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        this.intcode[tg] = v1 * v2;
        this.debugOutput(instr);
        return 4;
      }
      case 3: {
        this.intcode[this.intcode[this.ptr + 1]] = this.input;
        this.debugOutput(instr);
        return 2;
      }
      case 4: {
        this.debugOutput(instr);
        return 2;
      }
      case 5: {
        // FIX: v2 is in position mode if no param mode is explicitly set!
        const [v1, v2, tg] = this.getParamsTarget(instr);
        this.debugOutput(instr);
        if (v1 !== 0) {
          this.ptr = v2;
          return 0;
        }
        return 3;
      }
      case 6: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        this.debugOutput(instr);
        if (v1 === 0) {
          this.ptr = v2;
          return 0;
        }
        return 3;
      }
      case 7: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 < v2) {
          this.intcode[tg] = 1;
        } else {
          this.intcode[tg] = 0;
        }
        this.debugOutput(instr);
        return 4;
      }
      case 8: {
        const [v1, v2, tg] = this.getParamsTarget(instr);
        if (v1 === v2) {
          this.intcode[tg] = 1;
        } else {
          this.intcode[tg] = 0;
        }
        this.debugOutput(instr);
        return 4;
      }
      default:
        return 1;
    }
  },

  run: function run() {
    console.table(this.intcode);
    while (this.intcode[this.ptr] !== 99) {
      const instruction = this.parseInstruction(this.intcode[this.ptr]);
      const steps = this.runInstruction(instruction);

      // debug
      if (Number.isNaN(instruction.opcode)) {
        console.log(this.intcode);
        process.exit();
      }
      // console.log(`opcode: ${instruction.opcode}, pmode1: ${instruction.pmode1}, pmode2: ${instruction.pmode2}, pointer: [${this.ptr}] = ${this.intcode[this.ptr]}, steps: ${steps}`);

      this.ptr += steps;
    }
  },
};

// icComputer.init(1, file).run();
icComputer.init(0, file).run();
