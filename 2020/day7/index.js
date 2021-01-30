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

const listaCoresRegras = readFile();

let corBagsMapa = [];
listaCoresRegras.forEach((regra) => {
  const [cor, r] = regra.split(" bags contain ");
  corBagsMapa[cor] = r;
});
const cores = Object.keys(corBagsMapa);

let coresContemBag = [];
const pesquisarBag = (bagPesquisada) => {
  for (const cor of cores) {
    if (cor === bagPesquisada) {
      continue;
    }
    const temCor = corBagsMapa[cor].indexOf(bagPesquisada) > 0;
    if (temCor && typeof coresContemBag[cor] === "undefined") {
      coresContemBag[cor] = true;
      pesquisarBag(cor);
    }
  }
};

let regex = new RegExp("([0-9]+) (cor) bag", "g");
let texto = "";
texto.match(regex);

let corPesquisa = "shiny gold";
pesquisarBag(corPesquisa);

console.log({ bag: corPesquisa, total: Object.keys(coresContemBag).length });

let somaCores = [];
const somaBags = (cor, number) => {
  const primeiraCor = typeof number === "undefined";
  if (primeiraCor) {
    number = 1;
  } else {
    if (somaCores[cor]) {
      somaCores[cor] += number;
    } else {
      somaCores[cor] = number;
    }
  }

  let regexBagsContidas = new RegExp("([0-9]+) ([a-z\\s])+ bag", "g");
  let bags = corBagsMapa[cor].match(regexBagsContidas) || [];
  for (const bag of bags) {
    let [num, c] = bag.replace(/([0-9])+ ([a-z\s]+) bag/g, "$1:$2").split(":");
    somaBags(c, num * number);
  }
};

somaBags(corPesquisa);

console.log({
  soma: Object.values(somaCores).reduce((total, value) => total + value)
});

// shiny gold bags contain 2 dark red bags.
// dark red bags contain 2 dark orange bags.
// dark orange bags contain 2 dark yellow bags.
// dark yellow bags contain 2 dark green bags.
// dark green bags contain 2 dark blue bags.
// dark blue bags contain 2 dark violet bags.
// dark violet bags contain no other bags.

// gold=1          1
// red=2*gold      2
// orange=2*red    4
// yellow=2*orange 8
// green=2+yellow  16
// blue=2*green    32
// violet=2*blue   64
