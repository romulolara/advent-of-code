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

const keys = {
  byr: "(Birth Year)",
  iyr: "(Issue Year)",
  eyr: "(Expiration Year)",
  hgt: "(Height)",
  hcl: "(Hair Color)",
  ecl: "(Eye Color)",
  pid: "(Passport ID)",
  cid: "(Country ID)"
};

const chaves = Object.keys(keys);

const validadeFields = (chave, valor) => {
  if (chave === chaves[0]) {
    const num = Number(valor);
    return num >= 1920 && num <= 2002;
  } else if (chave === chaves[1]) {
    const num = Number(valor);
    return num >= 2010 && num <= 2020;
  } else if (chave === chaves[2]) {
    const num = Number(valor);
    return num >= 2020 && num <= 2030;
  } else if (chave === chaves[3]) {
    const regex = new RegExp(/^([0-9]+)(cm|in)$/);

    if (regex.test(valor)) {
      const valores = valor.replace(regex, "$1 $2").split(" ");
      if ("cm" === valores[1]) {
        const num = Number(valores[0]);
        return num >= 150 && num <= 193;
      } else {
        const num = Number(valores[0]);
        return num >= 59 && num <= 76;
      }
    } else {
      return false;
    }
  } else if (chave === chaves[4]) {
    const regex = new RegExp(/^#[0-9a-f]{6}$/);
    return regex.test(valor);
  } else if (chave === chaves[5]) {
    const ecl = ["amb", "blu", "brn", "gry", "grn", "hzl", "oth"];
    return ecl.includes(valor);
  } else if (chave === chaves[6]) {
    const regex = new RegExp(/^[0-9]{9}$/);
    return regex.test(valor);
  } else {
    return true;
  }
};

let docs = [];
let passports = [];
let northCredentials = [];
let invalids = [];
let invalidFields = [];

let document = "";
for (const linha of input) {
  if (!linha && document) {
    docs.push(document);
    document = "";
  } else {
    document += " " + linha;
  }
}

for (let d of docs) {
  let fields = d.replace(/\s+/g, " ");

  let hasCid = true;
  let isValid = true;
  let isValidFields = true;
  for (const c of chaves) {
    const check = fields.match(c + ":") ? fields.match(c + ":").length : 0;
    if (!check) {
      if (c === "cid") {
        hasCid = false;
      } else {
        isValid = false;
        break;
      }
    } else {
      const regex = `^.*${c}\\:([^\\s]+).*$`;
      const regexObj = new RegExp(regex);
      const valor = fields.replace(regexObj, "$1");
      if (!validadeFields(c, valor)) {
        isValidFields = false;
      }
    }
  }

  if (!isValid) {
    invalids.push(fields);
  } else if (!isValidFields) {
    invalidFields.push(fields);
  } else if (!hasCid) {
    northCredentials.push(fields);
  } else {
    passports.push(fields);
  }
}

console.log({
  docs: docs.length,
  missingFields: invalids.length,
  northCredentials: northCredentials.length,
  invalidFields: invalidFields.length,
  passports: passports.length
});
