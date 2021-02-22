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

//Each bus has an ID number that also indicates how often the bus leaves for the airport.

//Bus schedules are defined based on a timestamp that measures the number of minutes since
// some fixed reference point in the past. At timestamp 0, every bus simultaneously departed from the sea port.

//The time this loop takes a particular bus is also its ID number:
// the bus with ID 5 departs from the sea port at timestamps 0, 5, 10, 15, and so on.

//Your notes (your puzzle input) consist of two lines.
// The first line is your estimate of the earliest timestamp you could depart on a bus.
// The second line lists the bus IDs that are in service according to the shuttle company;
// entries that show x must be out of service, so you decide to ignore them.

const earliestTime = Number(notes[0]);
const idBuses = notes[1].replace(/,x/g, "").split(",");

console.log({ earliestTime, idBuses });

let busLoops = [];
let earliestBus = {
  bus: null,
  time: null
};

for (let bus of idBuses) {
  bus = Number(bus);
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
