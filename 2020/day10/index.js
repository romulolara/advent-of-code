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

function findTotalArrangements(firstAdapter = 0, lastAdapter = 0, total = 0) {
  if (firstAdapter === lastAdapter) {
    total++;
  } else if (firstAdapter < lastAdapter) {
    if (adapters.includes(firstAdapter + 1)) {
      total += findTotalArrangements(firstAdapter + 1, lastAdapter);
    }
    if (adapters.includes(firstAdapter + 2)) {
      total += findTotalArrangements(firstAdapter + 2, lastAdapter);
    }
    if (adapters.includes(firstAdapter + 3)) {
      total += findTotalArrangements(firstAdapter + 3, lastAdapter);
    }
  }
  return total;
}

// console.log(diff3Adapters);
let calcPart2 = 1;
for (let i = 0; i < diff3Adapters.length; i++) {
  const startAdapter = i === 0 ? 0 : diff3Adapters[i - 1];
  const endAdapter = diff3Adapters[i];

  let count = findTotalArrangements(startAdapter, endAdapter);
  if (count === 0) count = 1;
  calcPart2 *= count;

  // console.log({
  //   startAt: startAdapter,
  //   endAt: endAdapter,
  //   startIdx: adapters.indexOf(startAdapter),
  //   endIdx: adapters.indexOf(endAdapter),
  //   count
  // });
}

console.log({ calcPart2 });
