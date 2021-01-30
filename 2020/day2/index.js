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

let contador = (novoContador = 0);
for (const i of input) {
  const [linha, padrao, letra, senha] = ("" + i).match(
    /([0-9\-]+)\s([a-z])\:\s(.+)$/
  );

  const regex = new RegExp(letra, "g");
  const matches = senha.match(regex);
  const numMatches = matches ? matches.length : 0;

  const [f, s] = padrao.split("-");
  if (numMatches >= f && numMatches <= s) {
    contador++;
    console.log(padrao, letra, senha);
  }

  if (numMatches) {
    const occur1 = senha.substr(f - 1, 1);
    const occur2 = senha.substr(s - 1, 1);

    if (occur1 != occur2 && [occur1, occur2].includes(letra)) {
      novoContador++;
      console.log(padrao, letra, senha);
    }
  }
}

console.log("senhas corretas: ", contador, novoContador);
