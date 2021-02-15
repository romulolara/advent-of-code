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

function printMap(map, round, log = null) {
  if (log === "all" || log === "round") {
    console.log(round);
  }

  if (log === "all" || log === "map") {
    map.forEach((linha, indice) => {
      console.log({ [indice]: linha });
    });
  }
  return;
}

function countOccupiedSeats(count, line = "") {
  return count + line.replace(/[^#]/g, "").length;
}

function changeSeat(seat, adjacents = "", newRule = false) {
  if (seat == "L" && adjacents.indexOf("#") < 0) {
    return "#";
  }
  let tolerance = newRule ? 5 : 4;
  if (seat === "#" && adjacents.replace(/[^#]/g, "").length >= tolerance) {
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
  printMap(newMap, { newOccupied, rounds: ++rounds });

  if (occupied === newOccupied) {
    console.log({ part1Count: newOccupied });
    return;
  } else {
    updateSeatsMap(newMap, newOccupied, rounds);
  }
}

updateSeatsMap(seatsMap);

function findFirstAdjacents(map, l, c) {
  if (map[l][c] === ".") {
    return "";
  }
  return Object.keys(directions).reduce((total, direction) => {
    let nextSeat = findNextSeat(map, l, c, direction);
    let [nextL, nextC] = directions[direction](l, c);
    while (nextSeat != "" && nextSeat != "L" && nextSeat != "#") {
      nextSeat = findNextSeat(map, nextL, nextC, direction);
      [nextL, nextC] = directions[direction](nextL, nextC);
    }
    return total + nextSeat;
  }, "");
}

function updateSeatsMapPart2(map, occupied = 0, rounds = 0) {
  const mapLength = map.length;
  const lineLength = map[0].length;
  let newMap = [];

  for (let i = 0; i < mapLength; i++) {
    let newLine = "";
    for (let j = 0; j < lineLength; j++) {
      const adjacents = findFirstAdjacents(map, i, j);
      newLine += changeSeat(map[i][j], adjacents, true);
    }
    newMap.push(newLine);
  }

  let newOccupied = newMap.reduce(countOccupiedSeats, 0);
  printMap(newMap, { newOccupied, rounds: ++rounds });

  if (occupied === newOccupied) {
    console.log({ part2Count: newOccupied });
    return;
  } else {
    updateSeatsMapPart2(newMap, newOccupied, rounds);
  }
}

updateSeatsMapPart2(seatsMap);
