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

const input = readFile();

const getPosicaoLinhaAtual = (slope, pInit) => {
  if (!pInit) {
    return [0, 0];
  } else {
    pInit[0] += slope[0];
    pInit[1] += slope[1];
    return pInit;
  }
};

const regex = new RegExp("#", "g");
let larguraMapa = input[0].length;
let alturaMapa = input.length;
let somaArvores = 0;
let multiplicacaoArvores = 1;

const slopes = [
  [1, 1],
  [3, 1],
  [5, 1],
  [7, 1],
  [1, 2]
];

console.log("INIT: ", { larguraMapa, alturaMapa });

for (const slope of slopes) {
  let pAtual = getPosicaoLinhaAtual(slope);
  let locais = "";

  console.log("SLOPE: ", { pAtual, slope });

  for (let index = 0; index < input.length; index = index + slope[1]) {
    const linha = input[index];
    if (index === 0) {
      continue;
    }

    pAtual = getPosicaoLinhaAtual(slope, pAtual);
    if (pAtual[0] >= larguraMapa) {
      pAtual[0] = pAtual[0] - larguraMapa;
    }
    const [x, y] = pAtual;
    locais += linha.substr(x, 1);
  }

  const arvores = locais.match(regex) ? locais.match(regex).length : 0;
  somaArvores += arvores;
  multiplicacaoArvores *= arvores;

  console.log("END: ", {
    pAtual,
    arvores,
    somaArvores,
    multiplicacaoArvores
  });
}
