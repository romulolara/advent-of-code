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
  if (seat === "#" && adjacents.replace(/[^#]/g, "").length >= 4) {
    return "L";
  }
  return seat;
}

const directions = {
  diagUL: (l, c) => [l - 1, c - 1],
  up: (l, c) => [l - 1, c],
  diagUR: (l, c) => [l - 1, c + 1],
  left: (l, c) => [l, c - 1],
  right: (l, c) => [l, c + 1],
  diagDL: (l, c) => [l + 1, c - 1],
  down: (l, c) => [l + 1, c],
  diagDR: (l, c) => [l + 1, c + 1]
};

function findNextSeat(map, l, c, direction) {
  let [newL, newC] = directions[direction](l, c);
  if (map[newL]) {
    return map[newL][newC] ? map[newL][newC] : "";
  } else {
    return "";
  }
}

function findAdjacents(map, l, c) {
  return Object.keys(directions).reduce((total, direct) => {
    return total.concat(findNextSeat(map, l, c, direct));
  }, "");
}

function updateSeatsMap(map, occupied = 0, rounds = 0) {
  const mapLength = map.length;
  const lineLength = map[0].length;
  let newMap = [];

  for (let i = 0; i < mapLength; i++) {
    let newLine = "";
    for (let j = 0; j < lineLength; j++) {
      const adjacents = findAdjacents(map, i, j);
      newLine += changeSeat(map[i][j], adjacents);
    }
    newMap.push(newLine);
  }
  let newOccupied = newMap.reduce(countOccupiedSeats, 0);
  console.log({ newOccupied, rounds: ++rounds });

  printMap(newMap);
  if (occupied === newOccupied) {
    return;
  } else {
    updateSeatsMap(newMap, newOccupied, rounds);
  }
}

updateSeatsMap(seatsMap);
