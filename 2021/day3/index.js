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

// diagnostReport
const lines = readFile();

// gmma = most common bits
// epsilon = least common bits
// powerConsumption = gmmaRate * epsilonRate

function getBitsCounts(bytes = []) {
  let countsBit1 = [];
  bytes.forEach((b) =>
    b.split("").forEach((bit, ix) => {
      if (typeof countsBit1[ix] == "undefined") {
        countsBit1[ix] = 0;
      }
      countsBit1[ix] += Number(bit);
    })
  );
  console.log({ total: bytes.length, ...countsBit1 });
  return countsBit1;
}

function getRates(bytes = [], bits = []) {
  const halfLines = Math.floor(bytes.length / 2);

  const gmmaBin = bits.reduce(
    (bin, b) => (b > halfLines ? bin + "1" : bin + "0"),
    ""
  );

  let gmmaDec = parseInt(gmmaBin, 2);
  let epsilonBin = (gmmaDec ^ 0b111111111111).toString(2);
  let epsilonDec = parseInt(epsilonBin, 2);

  console.log({ gmmaBin, epsilonBin, gmmaDec, epsilonDec });
  return [gmmaDec, epsilonDec];
}

const counts = getBitsCounts(lines);
const [gmmaRate, epsilonRate] = getRates(lines, counts);

console.log({ powerConsumption: gmmaRate * epsilonRate });

// life support rating = oxygen generator rating * CO2 scrubber rating

function getBitMostCommon(numbers = [], totalNumbersWith1AtIdx) {
  const halfTotalNumbers = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0 && totalNumbersWith1AtIdx === halfTotalNumbers) {
    return "1";
  } else {
    return totalNumbersWith1AtIdx > halfTotalNumbers ? "1" : "0";
  }
}

function getBitLeastCommon(numbers = [], totalNumbersWith1AtIdx) {
  const halfTotalNumbers = Math.floor(numbers.length / 2);
  if (numbers.length % 2 === 0 && totalNumbersWith1AtIdx === halfTotalNumbers) {
    return "0";
  } else {
    return totalNumbersWith1AtIdx > halfTotalNumbers ? "0" : "1";
  }
}

function getRating(numbers = [], criteriaMostCommon = true, idx = 0) {
  if (numbers.length > 1 && idx < numbers[0].length) {
    const totalNumbersWith1AtIdx = numbers.reduce((total, n) => {
      total += Number(n[idx]);
      return total;
    }, 0);

    const bitAtIdx = criteriaMostCommon
      ? getBitMostCommon(numbers, totalNumbersWith1AtIdx)
      : getBitLeastCommon(numbers, totalNumbersWith1AtIdx);
    const similarNumbers = numbers.filter((n) => bitAtIdx === n[idx]);
    return getRating(similarNumbers, criteriaMostCommon, ++idx);
  } else {
    return numbers[0];
  }
}

const oxygenRatingBin = getRating(lines);
const oxygenRatingDec = parseInt(oxygenRatingBin, 2);
const co2RatingBin = getRating(lines, false);
const co2RatingDec = parseInt(co2RatingBin, 2);

console.log({
  oxygenRatingBin,
  oxygenRatingDec,
  co2RatingBin,
  co2RatingDec,
  lifeSupportRating: oxygenRatingDec * co2RatingDec
});
