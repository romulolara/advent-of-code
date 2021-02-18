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

const navigation = readFile();

const orientations = ["east", "south", "west", "north"];
let orientation = orientations[0];

function getOrientation(action) {
  if (action === "E") {
    return orientations[0];
  } else if (action === "S") {
    return orientations[1];
  } else if (action === "W") {
    return orientations[2];
  } else if (action === "N") {
    return orientations[3];
  } else {
    console.log({ erro: action });
    return null;
  }
}

function convertInstruction(instruction = "") {
  const [inst, o, turn, forward, value] = instruction.match(
    /([NSEW]?)([LR]?)([F]?)([0-9]+)/
  );
  return {
    type: o ? "MOVE" : turn ? "TURN" : "FORWARD",
    action: o || turn || forward,
    value: Number(value)
  };
}

function turnOrientation(current, { action, value }) {
  const total = orientations.length;
  const steps = value / 90;
  let next = orientations.indexOf(current);
  if (action === "R") {
    next = next + steps >= total ? next + steps - total : next + steps;
  } else {
    next = next - steps < 0 ? next - steps + total : next - steps;
  }
  return orientations[next];
}

function moveOrientation(currentMoves, o, { value }) {
  currentMoves[o] += value;
  return currentMoves;
}

function turnWaypoint(currentWaypoint, { action, value }) {
  let nextWaypoint = [];
  Object.keys(currentWaypoint).forEach((k) => {
    nextWaypoint[turnOrientation(k, { action, value })] = currentWaypoint[k];
  });
  return nextWaypoint;
}

function moveShip(currentWaypoint, currentShip, { value }) {
  Object.keys(currentWaypoint).forEach((k) => {
    currentShip[k] = currentShip[k] + currentWaypoint[k] * value;
  });
  return currentShip;
}

function moveWaypoint(currentWaypoint, newO, { value }) {
  if (Object.keys(currentWaypoint).includes(newO)) {
    currentWaypoint[newO] += value;
  } else {
    let inverseO = turnOrientation(newO, { action: "R", value: 180 });
    let inverseV = currentWaypoint[inverseO] - value;

    if (inverseV < 0) {
      let newWaypoint = [];
      Object.keys(currentWaypoint).forEach((k) => {
        if (k === inverseO) {
          newWaypoint[newO] = Math.abs(inverseV);
        } else {
          newWaypoint[k] = currentWaypoint[k];
        }
      });
      return newWaypoint;
    } else {
      currentWaypoint[inverseO] = inverseV;
    }
  }
  return currentWaypoint;
}

let moves = {
  east: 0,
  south: 0,
  west: 0,
  north: 0
};

let ship = {
  east: 0,
  south: 0,
  west: 0,
  north: 0
};

let waypoint = {
  east: 10,
  north: 1
};

function navigate(instruction) {
  if (instruction) {
    const { type, action, value } = convertInstruction(instruction);
    // console.log(instruction, { type, action, value });
    if (type === "FORWARD") {
      moves = moveOrientation(moves, orientation, { value });
      ship = moveShip(waypoint, ship, { value });
    } else if (type === "MOVE") {
      const newO = getOrientation(action);
      moves = moveOrientation(moves, newO, { value });
      waypoint = moveWaypoint(waypoint, newO, { value });
    } else if (type === "TURN") {
      orientation = turnOrientation(orientation, { action, value });
      waypoint = turnWaypoint(waypoint, { action, value });
    }
  }
}

for (const i of navigation) {
  navigate(i);
}

console.log({
  orientation,
  moves,
  distanceP1:
    Math.abs(moves.east - moves.west) + Math.abs(moves.north - moves.south),
  ship,
  waypoint,
  distanceP2:
    Math.abs(ship.east - ship.west) + Math.abs(ship.north - ship.south)
});
