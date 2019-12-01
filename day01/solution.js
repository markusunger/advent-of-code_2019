const fs = require('fs').promises;

const input = fs.readFile('input.txt', 'utf8');

const calcFuelMass = mass => Math.floor(mass / 3) - 2;

function calcFuel(mass) {
  const fuelMass = calcFuelMass(mass);
  return mass <= 0 ? 0 : mass + calcFuelMass(fuelMass);
}

(function solutionPart1() {
  input
    .then((masses) => {
      console.log(masses.split('\n').reduce((sum, mass) => sum + calcFuelMass(mass), 0));
    });
}());

(function solutionPart2() {
  input
    .then((masses) => {
      console.log(masses
        .split('\n')
        .map(m => Number(calcFuel(m)))
        .reduce((sum, m) => sum + m), 0);
    });
}());
