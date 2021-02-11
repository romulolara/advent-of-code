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

let adapters = readFile();
adapters = adapters.map((n) => Number(n)).sort((a, b) => a - b);

const builtInAdapter = Number(adapters[adapters.length - 1]) + 3;
adapters.push(builtInAdapter);
adapters.unshift(0);

let diff1Count = 0;
let diff3Count = 0;
let diff3Adapters = [];
for (let i = 0; i < adapters.length - 1; i++) {
  const adapter = Number(adapters[i]);
  const nextAdapter = Number(adapters[i + 1]);
  const diff = nextAdapter - adapter;

  if (diff === 1) {
    diff1Count++;
  } else if (diff === 3) {
    diff3Count++;
    diff3Adapters.push(nextAdapter);
  }
}

console.log({
  diff1Count,
  diff3Count,
  calcPart1: diff1Count * diff3Count
});
