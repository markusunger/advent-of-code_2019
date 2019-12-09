/* eslint-disable prefer-destructuring */

const fs = require('fs');

const file = fs.readFileSync('input.txt', 'utf8').split(',').map(Number);

const intcodeProcessor = {
  init: function init(input) {
    this.input = input;
    this.output = [];
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
    // not actually necessary right now because of JS array behavior
    this.intcode[address] = value;
  },

  parse: function parse(instruction) {
    const ARITIES = {
      1: 3, 2: 3, 3: 1, 4: 1, 5: 2, 6: 2, 7: 3, 8: 3, 9: 1, 99: 0,
    };

    const instr = String(instruction);
    const opcode = Number(instr.slice(-1));
    const paramModes = instr.slice(0, -2).split('').reverse().map(Number);

    const params = [...Array(ARITIES[opcode]).keys()].reduce((info, num) => {
      const paramMode = paramModes[num] || 0;
      let address = this.readMem(this.ptr + num + 1);
      if (paramMode === 2) address += this.relBase;

      let value;
      if (paramMode === 0 || paramMode === 2) value = this.readMem(address);
      if (paramMode === 1) value = address;

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
    // console.log(instr);
    const ic = this.intcode;
    const { addresses, values } = instr;
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
        this.output.push(values[0]);
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
    console.log(this.output);
  },
};

intcodeProcessor.init(2).run();
