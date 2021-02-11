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

const seatsMap = readFile();

function printMap(map, ignore = true) {
  if (ignore) {
    return;
  }
  map.forEach((linha, indice) => {
    console.log({ [indice]: linha });
  });
}

function countOccupiedSeats(count, line = "") {
  return count + line.replace(/[^#]/g, "").length;
}

function changeSeat(seat, adjacents = "") {
  if (seat == "L" && adjacents.indexOf("#") < 0) {
    return "#";
  }
  if (seat === "#" && adjacents.replace(/[^#]/g, "").length > 4) {
    return "L";
  }
  return seat;
}

let rounds = 0;
function updateSeatsMap(map, occupied = 0) {
  const mapLength = map.length;
  const lineLength = map[0].length;

  let newMap = [];
  for (let i = 0; i < mapLength; i++) {
    const iBefore = i - 1;
    const iAfter = i + 1;
    let newLine = "";
    for (let j = 0; j < lineLength; j++) {
      let rightCol = j - 1;
      let len = 3;
      if (j === 0) {
        rightCol = 0;
        len = 2;
      }
      let bSeats = iBefore >= 0 ? map[iBefore].substr(rightCol, len) : "";
      let mSeats = map[i].substr(rightCol, len);
      let aSeats = iAfter < mapLength ? map[iAfter].substr(rightCol, len) : "";

      const adjacents = bSeats.concat(mSeats).concat(aSeats);
      newLine += changeSeat(map[i][j], adjacents);
    }
    newMap.push(newLine);
  }

  printMap(newMap);
  let newOccupied = newMap.reduce(countOccupiedSeats, 0);
  console.log({ newOccupied, rounds: ++rounds });

  if (occupied === newOccupied) {
    return;
  } else {
    updateSeatsMap(newMap, newOccupied);
  }
}

updateSeatsMap(seatsMap);
