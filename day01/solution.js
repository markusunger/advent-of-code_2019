const fs = require('fs').promises;

const input = fs.readFile('input.txt', 'utf8');

const calcFuelMass = mass => Math.floor(mass / 3) - 2;

(function solutionPart1() {
  input
    .then((masses) => {
      console.log(masses.split('\n').reduce((sum, mass) => sum + calcFuelMass(mass), 0));
    });
}());
