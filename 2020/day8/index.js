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

const bootCode = readFile();

const nextOp = (op, arg, index) =>
  op !== "jmp" ? index + 1 : index + Number(arg);

const newAcc = (op, arg, acc) => {
  switch (op) {
    case "acc":
      return acc + Number(arg);
    case "jmp":
      return null;
    default:
      return acc;
  }
};

const isFix = (op) => {
  const [o, arg] = op.split(" ");
  const isJmp = o === "jmp";
  const isNop = o === "nop" && 0 !== Number(arg);
  return isJmp || isNop;
};

const fix = (op) => (op === "jmp" ? "nop" : "jmp");

let execs = [];
let jmpNopFixable = [];
let fixed = true;
const runInstrucao = (i = 0, acc = 0) => {
  if (i === bootCode.length) {
    throw new Error("fim do boot: " + acc);
  }

  let [op, arg] = bootCode[i].split(" ");

  if (!fixed && typeof jmpNopFixable[i] === "undefined" && isFix(op)) {
    jmpNopFixable[i] = { op, arg };
    fixed = true;
    op = fix(op);
  }

  const next = nextOp(op, arg, i);
  if (
    typeof execs[next] !== "undefined" &&
    typeof execs[next].acc !== "undefined"
  ) {
    return acc;
  }

  const accValue = newAcc(op, arg, acc);
  if (null !== accValue) {
    acc = accValue;
    execs[i] = { op, arg, acc };
  }
  return runInstrucao(next, acc);
};

console.log({ acumulador: runInstrucao() });

jmpNopFixable = [];
const totalFixable = bootCode.filter(isFix).length;
try {
  for (let index = 0; index < totalFixable; index++) {
    execs = [];
    fixed = false;
    runInstrucao();
  }
} catch (error) {
  console.log(error.message);
}
