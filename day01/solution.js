const fs = require('fs').promises;

const input = fs.readFile('input.txt', 'utf8');

const calcFuelMass = mass => Math.floor(mass / 3) - 2;
const totalFuelMass = (mass) => {
  const fuelMass = calcFuelMass(mass);
  return fuelMass <= 0 ? 0 : fuelMass + totalFuelMass(fuelMass);
};

(function solutionPart1() {
  input
    .then((masses) => {
      console.log(
        masses
          .split('\n')
          .reduce((sum, mass) => sum + calcFuelMass(mass), 0),
      );
    });
}());

(function solutionPart2() {
  input
    .then((masses) => {
      console.log(
        masses
          .split('\n')
          .map(totalFuelMass)
          .reduce((sum, mass) => sum + mass),
      );
    });
}());
