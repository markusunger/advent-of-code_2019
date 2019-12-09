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

const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

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
    const ARITIES = {
      1: 3,
      2: 3,
      3: 1,
      4: 1,
      5: 2,
      6: 2,
      7: 3,
      8: 3,
      9: 1,
      99: 0,
    };

    const instr = instruction.toString();
    const params = instr.slice(0, -2).split('').reverse().map(Number);
    // TODO: create addresses and values to return with object
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

      case 9: {
        break;
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
