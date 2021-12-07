var fs = require("fs");

const readFile = () => {
  try {
    var data = fs.readFileSync("input.txt", {
      encoding: "utf8",
      flag: "r"
    });
    return data ? data.trim().split("\n") : [];
  } catch (error) {
    throw new Error("Error on reading puzzle. " + error.message);
  }
};

const lines = readFile();
const numbers = lines.map((n) => Number(n));

function countIncreases(numberList = []) {
  return numberList.reduce(
    (total, n, i) => (n > numberList[i - 1] ? ++total : total),
    0
  );
}
console.log({ increases: countIncreases(numbers) });