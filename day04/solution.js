/*
  input: range of six-digit integers
  output: number of possible passwords in that input range
          that are valid
  problem: a valid password has:
             - six digits
             - never decreasing numbers going from left to right
             - at least two adjacent digits are the same
  algorithm: generate all numbers in input range
               generator function that yields one number after the other
             for each number, check if valid password
               validation:
                 find at least two adjacent digits that are the same with regex
                 split number into characters, iterate with for -> as soon as digit
                   is less than digit on previous index position -> return false
               if valid, add to array of valid passwords
             return length of valid passwords array
             for part 2:
               filter passwords array for passwords that do not have exactly two
               occurences of a digit
*/

const inputMin = 272091;
const inputMax = 815432;

(function solution() {
  function* numberGenerator() {
    let num = inputMin;
    while (num <= inputMax) yield num += 1;
  }

  function isValidPassword(num) {
    if (!String(num).match(/(\d)\1/)) return false;
    return String(num)
      .split('')
      .every((digit, idx) => idx === 0 || (Number(digit) >= String(num).charAt(idx - 1)));
  }

  (function bruteForce() {
    const generator = numberGenerator();
    let candidate = generator.next().value;
    const passwords = [];

    while (candidate) {
      if (isValidPassword(candidate)) passwords.push(candidate);
      candidate = generator.next().value;
    }

    console.log(passwords.length); // part 1

    console.log(
      passwords.filter((pw) => {
        const digits = String(pw).split('');
        return digits
          .some(digit => digits.filter(d => d === digit).length === 2);
      }).length, // part 2
    );
  }());
}());
