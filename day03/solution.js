/*
  input: directions for two wires, each one a new line
         comma-separated directional instructions
  output: part 1 - closes intersection of the two wires to the central port
                   measured by the Manhattan distance
          part 2 - fewest steps in sum for both wires to an intersection
  problem: wires extend from a central port (location 0,0),
           extension expressed as directional instructions:
           R/L/U/D followed by the number of spaces on the grid
           if both wires occupy the same grid coordinate, they intersect
  data structure: two arrays (one per wire) of coordinates holding the wire
  algorithm: split each wire line from the input by comma,
             regex direction + the distance
             starting from 0,0 (not including) start putting coordinates
             into another array counting either x or y up/down depending
             on direction (R: x + 1, y; L: x - 1, y; D: x, y - 1, U: x, y + 1)
               use strings as coordinates to be able to use includes on arrays
             find common coordinates between arrays -> intersections
              (filter first one for entries that also are included in second one)
             part 1 -
              calculate Manhattan distance for each and output the lowest distance
             part 2 -
              get first indices of each intersection for both wires,
              add together (+1 each because 0-based indexing!), return lowest sum

*/

const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').split('\n');

const wires = [];
input.forEach((wire) => {
  let position = [0, 0];
  const directions = wire.split(',');
  const coords = directions.reduce((arr, direction) => {
    const extract = direction.match(/([A-Z])(\d*)/);
    const [dir, dist] = [extract[1], Number(extract[2])];
    for (let i = 1; i <= dist; i += 1) {
      switch (dir) {
        case 'R':
          arr.push(`${position[0] + i},${position[1]}`);
          break;
        case 'L':
          arr.push(`${position[0] - i},${position[1]}`);
          break;
        case 'U':
          arr.push(`${position[0]},${position[1] + i}`);
          break;
        case 'D':
          arr.push(`${position[0]},${position[1] - i}`);
          break;
        default:
      }
    }
    position = arr.slice(-1)[0].split(',').map(Number);
    return arr;
  }, []);
  wires.push(coords);
});

const intersects = wires[0].filter(coord => wires[1].includes(coord));

// solution part 1
const distances = intersects.map((coord) => {
  const c = coord.split(',').map(Number);
  return Math.abs(c[0]) + Math.abs(c[1]);
});
console.log(Math.min(...distances));

// solution part 2
const fewestSteps = intersects
  .map(coord => wires[0].indexOf(coord) + 1 + wires[1].indexOf(coord) + 1);
console.log(Math.min(...fewestSteps));
