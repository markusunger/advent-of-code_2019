/*
  FIX:
    decouple value determination from opcode handling
      -> parse method should determine amount of values needed (arity of opcode handling method)
      -> parse provides both memory locations and values

  ADD:
    support for out-of-bounds memory addresses
      -> wrapper around this.intcode that dynamically adds to existing array or handles
        read access from not-yet existing addresses
    support for relative parameter mode
      -> handle opcode 9 and change relative base accordingly
      -> parse method should determine correct memory addresses and values from relative base
*/

const fs = require('fs');

// const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);
const file = [3, 21, 1008, 21, 8, 20, 1005, 20, 22, 107, 8, 21, 20, 1006, 20, 31,
  1106, 0, 36, 98, 0, 0, 1002, 21, 125, 20, 4, 20, 1105, 1, 46, 104,
  999, 1105, 1, 46, 1101, 1000, 1, 20, 4, 20, 1105, 1, 46, 98, 99];

const intcodeProcessor = {
  init: function init(input) {
    this.input = input;
    this.intcode = file.slice();
    this.ptr = 0;
    this.relBase = 0;
    return this;
  },

  readMem: function getMem(address) {
    if (address >= this.intcode.length) {
      this.intcode[address] = 0;
      return this.intcode[address];
    }
    return this.intcode[address];
  },

  writeMem: function writeMem(address, value) {
    this.intcode[address] = value;
  },

  parse: function parse(instruction) {
    const ARITIES = { 1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1, 99: 0, };

    const instr = instruction.toString();
    const opcode = Number(instr.slice(-1));
    const paramModes = instr.slice(0, -2).split('').reverse().map(Number);

    const params = [...Array(ARITIES[opcode]).keys()].reduce((info, num) => {
      const v1 = this.intcode[this.ptr + num + 1];
      const paramMode = paramModes[num] ? paramModes[num] : 0;
      const address = this.intcode[this.ptr + num + 1];
      if (paramMode === 2) address += this.relBase;
      let value;
      if (paramMode === 0 || paramMode === 2) value = this.intcode[this.intcode[address]];
      if (paramMode === 1) value = this.intcode[address];
      info.addresses.push(address);
      info.values.push(value);
      info.paramModes.push(paramMode);
      return info;
    }, { addresses: [], values: [], paramModes: [] });

    return {
      string: instr,
      opcode,
      addresses: params.addresses,
      values: params.values,
      paramModes: params.paramModes,
    };
  },

  execute: function execute(instr) {
    console.log(instr);
    const ic = this.intcode;
    const { addresses, values } = instr;
    const { ptr } = this;
    switch (instr.opcode) {
      case 1: {
        ic[addresses[2]] = values[0] + values[1];
        return 4;
      }

      case 2: {
        ic[addresses[2]] = values[0] * values[1];
        return 4;
      }

      case 3: {
        ic[addresses[0]] = this.input;
        return 2;
      }

      case 4: {
        console.log(values[0]);
        return 2;
      }

      case 5: {
        if (values[0] !== 0) {
          this.ptr = values[1];
          return 0;
        }
        return 3;
      }

      case 6: {
        if (values[0] === 0) {
          this.ptr = values[1];
          return 0;
        }
        return 3;
      }

      case 7: {
        if (values[0] < values[1]) ic[addresses[2]] = 1;
        else ic[addresses[2]] = 0;
        return 4;
      }

      case 8: {
        if (values[0] === values[1]) ic[addresses[2]] = 1;
        else ic[addresses[2]] = 0;
        return 4;
      }

      case 9: {
        this.relBase += values[0];
        return 2;
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

intcodeProcessor.init(8).run();
