const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('');
const WIDTH = 25;
const HEIGHT = 6;

(function solutionPart1() {
  const layers = [];
  for (let i = 0; i < input.length; i += WIDTH * HEIGHT) {
    layers.push(input.slice(i, i + WIDTH * HEIGHT));
  }
  layers.sort((a, b) => {
    const a0 = a.reduce((total, digit) => (digit === '0' ? total + 1 : total), 0);
    const b0 = b.reduce((total, digit) => (digit === '0' ? total + 1 : total), 0);
    return a0 - b0;
  });

  const one = layers[0].reduce((ones, digit) => (digit === '1' ? ones + 1 : ones), 0);
  const two = layers[0].reduce((twos, digit) => (digit === '2' ? twos + 1 : twos), 0);
  console.log(one * two);
}());

(function solutionPart2() {
  const layers = [];
  for (let i = 0; i < input.length; i += WIDTH * HEIGHT) {
    layers.push(input.slice(i, i + WIDTH * HEIGHT));
  }
  const display = layers.reduce((obj, layer) => {
    const composite = obj;
    layer.forEach((digit, idx) => {
      if (!composite[idx]) composite[idx] = { fixed: false, value: '' };
      if (!composite[idx].fixed && digit !== '2') {
        composite[idx].value = digit;
        composite[idx].fixed = true;
      }
    });
    return composite;
  }, {});

  for (let i = 0; i < HEIGHT; i += 1) {
    let output = '';
    for (let j = 0; j < WIDTH; j += 1) {
      const { value } = display[(i * WIDTH + j).toString()];
      if (value === '0') output += ' ';
      else output += '#'; // better contrast in terminal
    }
    console.log(output);
  }
}());
