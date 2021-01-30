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

// input = ["FBFBBFFRLR"];
let assentos = [];

let mapa = [];

for (const ticket of input) {
  if (ticket) {
    const [row, col] = ticket.replace(/([BF]{7})([RL]{3})/, "$1:$2").split(":");
    let regiao = 128;
    let fileira = 0;
    let colunas = 8;
    let coluna = 0;

    for (const r of row.split("")) {
      regiao = regiao / 2;
      fileira += "F" === r ? 0 : regiao;
    }

    for (const c of col.split("")) {
      colunas = colunas / 2;
      coluna += "L" === c ? 0 : colunas;
    }

    let assento = fileira * 8 + coluna;
    assentos.push(assento);

    if (!mapa[fileira]) {
      mapa[fileira] = [];
    }

    mapa[fileira][coluna] = assento;
  }
}

assentos.sort((a, b) => a - b);
console.log({
  totalFleiras: Object.keys(mapa).length,
  totalAssentos: assentos.length,
  primeiro: assentos[0],
  ultimo: assentos[assentos.length - 1]
});

let minhaFileira = false;
for (const fileira of Object.keys(mapa)) {
  const colunas = Object.keys(mapa[fileira]);
  if (colunas.length != 8) {
    if (minhaFileira) {
      for (const c of [0, 1, 2, 3, 4, 5, 6, 7]) {
        if (!mapa[fileira][c]) {
          console.log({ meuAssento: fileira * 8 + c, fileira, coluna: c });
        }
      }
    }
    minhaFileira = !minhaFileira;
  }
}
