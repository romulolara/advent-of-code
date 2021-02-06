var fs = require("fs");

const readFile = () => {
  try {
    var data = fs.readFileSync("input.txt", {
      encoding: "utf8",
      flag: "r"
    });
    return data ? data.split("\n") : [];
  } catch (error) {
    return { erro: error.message, error };
  }
};

const numbers = readFile();

const preamble = 25;
let iTarget = preamble;
let target = null;
for (; iTarget < numbers.length; iTarget++) {
  let weakness = true;

  target = Number(numbers[iTarget]);
  for (let iNum1 = iTarget - preamble; iNum1 < iTarget; iNum1++) {
    if (numbers[iNum1] >= target) {
      continue;
    }
    const v1 = Number(numbers[iNum1]);
    const v2 = target - v1;
    const iNum2 = numbers.slice(iNum1, iTarget).indexOf(`${v2}`);

    if (iNum2 >= 0) {
      weakness = false;
      break;
    }
  }

  if (weakness) {
    console.log({ target, iTarget });
    break;
  }
}

const somar = (soma, num) => soma + num;
let weaknessArray = [];
const encryptionWeakness = (i = 0) => {
  if (i === 0) {
    const n = Number(numbers[i]);
    weaknessArray.push(n);
  }

  const total = weaknessArray.reduce(somar, 0);
  if (i === iTarget || total === target) {
    console.log("encerrou: ", { total, i });
    return weaknessArray;
  }

  if (total < target) {
    i++;
    const n = Number(numbers[i]);
    weaknessArray.push(n);
  } else {
    weaknessArray.shift();
  }
  return encryptionWeakness(i);
};

encryptionWeakness();

weaknessArray.sort();
const min = weaknessArray.shift();
const max = weaknessArray.pop();
const encryption = min + max;
console.log({ encryption, min, max });
