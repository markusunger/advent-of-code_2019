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

const input_min = 272091;
const input_max = 815432;

// const input_min = 1;
// const input_max = 2000;

(function solution() {
  function* numberGenerator() {
    let num = input_min;
    while (num <= input_max) yield num++;
  }

  function isValidPassword(num) {
    const numString = String(num);
    const regex = new RegExp(/(\d)\1/);
    if (!numString.match(regex)) return false;

    const numArr = numString.split('');
    return numArr.every((digit, idx) => idx === 0 | (Number(digit) >= numArr[idx - 1]));
  }

  (function solution() {
    const passwordGenerator = numberGenerator();
    let passwordCandidate = passwordGenerator.next();
    let passwords = [];

    while (!passwordCandidate.done) {
      const pw = passwordCandidate.value;
      if (isValidPassword(pw)) passwords.push(pw);
      passwordCandidate = passwordGenerator.next();
    }

    console.log(passwords.length); // part 1

    console.log(
      passwords.filter(pw => {
        const pwArr = String(pw).split('');
        const unique = new Set(pwArr);
        for (digit of unique) {
          if (pwArr.filter(d => d === digit).length === 2) return true;
        }
        return false;
      }).length // part 2
    );
  }());
}());
