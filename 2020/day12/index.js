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

let moves = {
  east: 0,
  south: 0,
  west: 0,
  north: 0
};

const instruction = {
  type: "type",
  action: "action",
  value: "value"
};

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
    return null;
  }
}

function convertInstruction(instruction = "") {
  const [inst, orientation, turn, forward, value] = instruction.match(
    /([NSEW]?)([LR]?)([F]?)([0-9]+)/
  );
  return {
    type: orientation ? "O" : turn ? "T" : "F",
    action: orientation || turn || forward,
    value: Number(value)
  };
}

function turnOrientation({ action, value }) {
  const total = orientations.length;
  const steps = value / 90;
  let next = orientations.indexOf(orientation);
  if (action === "R") {
    next = next + steps >= total ? next + steps - total : next + steps;
  } else {
    next = next - steps < 0 ? next - steps + total : next - steps;
  }
  // console.log({ orientation, next, o: orientations[next] });
  orientation = orientations[next];
}

function navigate(instruction) {
  if (instruction) {
    const { type, action, value } = convertInstruction(instruction);
    console.log({ instruction, type, action, value });
    if (type === "F") {
      moves[orientation] += value;
    } else if (type === "O") {
      moves[getOrientation(action)] += value;
    } else if (type === "T") {
      turnOrientation({ action, value });
    }
  }
}

for (const i of navigation) {
  navigate(i);
}

let ew = Math.abs(moves.east - moves.west);
let ns = Math.abs(moves.north - moves.south);

console.log({
  orientation,
  ew,
  ns,
  distance: ew + ns
});
