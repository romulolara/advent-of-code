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

const notes = readFile();

const earliestTime = Number(notes[0]);
const idBuses = notes[1]
  .replace(/,x/g, "")
  .split(",")
  .map((b) => Number(b));

console.log({ earliestTime, idBuses });

let busLoops = [];
let earliestBus = {
  bus: null,
  time: null
};

for (let bus of idBuses) {
  let loops = Math.trunc(earliestTime / bus);
  if (earliestTime % bus > 0) {
    loops += 1;
  }
  busLoops[bus] = loops;
  let time = loops * bus;
  if (!earliestBus.time || earliestBus.time > time) {
    earliestBus.bus = bus;
    earliestBus.time = time;
    earliestBus.loops = loops;
  }
}

earliestBus.waitTime = earliestBus.time - earliestTime;
earliestBus.calcPart1 = earliestBus.bus * earliestBus.waitTime;

console.log({ earliestBus });

const notesArray = notes[1].split(",");
const busOffset = (bus) => {
  return notesArray.indexOf(`${bus}`);
};

const isBusDepartAt = (bus, timestamp) => {
  const busTimestamp = timestamp + busOffset(bus);
  return busTimestamp % bus === 0;
};

const subsequentBusDepartAt = () => {
  const firstBus = idBuses[0];
  let time = firstBus,
    step = firstBus;
  for (let i = 1; i < idBuses.length; i++) {
    while (!isBusDepartAt(idBuses[i], time)) {
      time += step;
    }
    step *= idBuses[i];
  }
  return time;
};

// based on https://github.com/Akumatic/Advent-of-Code/tree/master/2020/13
console.log({ calcPart2: subsequentBusDepartAt() });
