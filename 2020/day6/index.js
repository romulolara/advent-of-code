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

let input = readFile();

const isUnique = (value, index, self) => self.indexOf(value) === index;
const somaTodasYes = (total, r) => {
  const regex = new RegExp(r, "g");
  const numPessoas = (respostas.match(regex) || []).length;
  return total + (numPessoas === pessoas ? 1 : 0);
};

let grupos = [];
let respostas = "";
let pessoas = 0;
let totalYes = 0;

let totalTodasYes = 0;

for (const linha of input) {
  if (!linha) {
    const unicas = respostas.split("").filter(isUnique).join("");
    const todasYes = unicas.split("").reduce(somaTodasYes, 0);

    const g = { respostas, unicas, pessoas, todasYes };
    grupos.push(g);

    totalYes += g.unicas.length;
    totalTodasYes += g.todasYes;
    pessoas = 0;
    respostas = "";
  } else {
    pessoas++;
    respostas += linha;
  }
}

console.log({ grupos: grupos.length, totalYes, totalTodasYes });
