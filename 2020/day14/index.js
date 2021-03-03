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

const initialization = readFile();

const isMaskLine = (line) => {
  return /[X01]{36}/.test(line);
};

const getMask = (line = "") => {
  return line.match(/[X01]{36}/)[0];
};

const getAddress = (line = "") => {
  return Number(line.match(/mem\[([0-9]+)/)[1]);
};

const getValue = (line) => {
  return Number(line.match(/\=\s([0-9]+)/)[1]);
};

const decToBin = (dec) => {
  let bin = "";
  let d = 0;
  if (dec != 0) {
    while (dec != 0) {
      d = dec % 2 === 0 ? "0" : "1";
      dec = Math.trunc(dec / 2);
      bin = d + bin;
    }
  } else {
    bin = "0";
  }
  return bin.padStart(36, "0");
};

const binToDec = (bin) => {
  let d = 0;
  for (let i = 0; i < bin.length; i++) {
    const bit = Number(bin[i]);
    const exp = bin.length - (i + 1);
    d += bit ? 2 ** exp : 0;
  }
  return d;
};

const applyMaskP1 = (bin, mask = "") => {
  let newBin = bin.toString().split("");

  for (let i = 0; i < 36; i++) {
    if (mask[i] === "0") {
      newBin[i] = "0";
    } else if (mask[i] === "1") {
      newBin[i] = "1";
    }
  }
  return binToDec(newBin.join(""));
};

const applyMaskP2 = (bin, mask = "") => {
  let newMask = bin.toString().split("");

  for (let i = 0; i < 36; i++) {
    if (mask[i] === "1") {
      newMask[i] = "1";
    } else if (mask[i] === "X") {
      newMask[i] = "X";
    }
  }
  return newMask.join("");
};

let memP1 = [];
let memP2Index = [];
let memP2 = [];
const writeToMem = (mem, address, value) => {
  if ("P1" === mem) {
    memP1[address] = value;
  } else {
    const i = memP2Index.indexOf(address);
    if (i >= 0) {
      memP2[i] = value;
    } else {
      memP2Index.push(address);
      memP2.push(value);
    }
  }
  // console.log({ addr: address, value, c: mem.length });
};

const decodeAddresses = (addrs, mask = "", i = 0) => {
  if (i < mask.length) {
    if (mask.charAt(i) === "X") {
      mask = mask.split("");
      mask[i] = "0";
      decodeAddresses(addrs, mask.join(""), i + 1);
      mask[i] = "1";
      decodeAddresses(addrs, mask.join(""), i + 1);
    } else {
      decodeAddresses(addrs, mask, i + 1);
    }
  } else {
    const addr = binToDec(mask);
    addrs.push(addr);
  }
};

let currentMask = "";
let currentAddress = 0;
let currentValue = 0;
for (const line of initialization) {
  if (line) {
    if (isMaskLine(line)) {
      currentMask = getMask(line);
    } else {
      currentAddress = getAddress(line);
      currentValue = getValue(line);
      const binValue = decToBin(currentValue);
      writeToMem("P1", currentAddress, applyMaskP1(binValue, currentMask));

      // console.log({
      //   currentAddress,
      //   currentValue,
      //   bin: decToBin(currentValue),
      //   dec: binToDec(decToBin(currentValue)),
      //   newDec: memP1[currentAddress]
      // });

      const binAddress = decToBin(currentAddress);
      let addrMasked = applyMaskP2(binAddress, currentMask);
      let addresses = [];
      decodeAddresses(addresses, addrMasked);
      // console.log({ addrMasked, total: addresses.length, addresses });

      for (const addr of addresses) {
        writeToMem("P2", addr, currentValue);
      }
    }
  }
}

console.log({ calcPart1: memP1.reduce((total, v) => total + v, 0) });
console.log({ calcPart2: memP2.reduce((total, v) => total + v, 0) });
