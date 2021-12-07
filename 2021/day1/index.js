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

let increases = 0;
let beforeMeasure = undefined;

numbers.forEach((n, i) => {
  if (n > beforeMeasure) {
		increases++;
	}
	beforeMeasure = n;
});

console.log({ increases });



