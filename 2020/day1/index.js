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

const numbers = readFile();

let maiores = [];
let menores = [];
let first = 0;
let second = 0;
let third = 0;

if (numbers.erro) {
  console.error(numbers.erro);
} else {
  for (const n of numbers) {
    if (n > 1010) {
      maiores.push(n);
    } else if (n < 1010) {
      menores.push(n);
    } else if (n === 1010) {
      if (first) {
        second = 1010;
        break;
      }
      first = 1010;
    }
  }

  if (!first && !second) {
    for (const m of menores) {
      first = m;
      second = 2020 - first;
      const i = `${numbers}`.indexOf(`${second}`);
      if (i >= 0) {
        break;
      }
    }
  }
  console.log({ first, second, answer: first * second });
}

lista = menores;
console.log(lista, lista.slice(1, lista.length - 1));
function funcao(soma = 0, numeros = [], lista = []) {
  if (soma === 2020 && numeros.length === 3) {
    console.log(numeros);
    return numeros;
  }
  let novaLista = lista;
  for (let index = 0; index < lista.length; index++) {
    if (soma > 2020) {
      // novaLista.splice(index, 1);
      continue;
    }
    const m = Number(lista[index]);
    funcao(soma + m, [...numeros, m], novaLista);
  }
  return numeros;
}

// function funcao(soma = 0, numeros = [], lista = [], i = 0) {
//   if (soma === 2020 || i === lista.length) {
//     return numeros;
//   } else if (soma < 2020) {
//     return funcao(soma + Number(lista[i]), [...numeros, lista[i]], lista, i+1);
//   } else {
// 		numeros = numeros.length > 0 ? numeros.splice(numeros.length-1, 1) : numeros;
//     return funcao(soma - Number(lista[i]), numeros, lista, i+1);
//   }
// }

console.log(funcao(0, [], numbers));
