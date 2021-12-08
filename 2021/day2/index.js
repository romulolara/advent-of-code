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

const lines = readFile();

let horizontal = 0;
let depth = 0;

lines.forEach((e, i) => {
  let mov = Number(e.split(" ")[1]);
  if (e.indexOf("forward") >= 0) {
    horizontal += mov;
  } else if (e.indexOf("down") >= 0) {
    depth += mov;
  } else {
    depth -= mov;
  }
});

console.log({ horizontal, depth, multi: horizontal * depth });

let aim = 0;
horizontal = 0;
depth = 0;

lines.forEach((e, i) => {
  let mov = Number(e.split(" ")[1]);
  if (e.indexOf("forward") >= 0) {
    horizontal += mov;
    depth += mov * aim;
  } else if (e.indexOf("down") >= 0) {
    aim += mov;
  } else {
    aim -= mov;
  }
});

console.log({ horizontal, depth, multi: horizontal * depth });