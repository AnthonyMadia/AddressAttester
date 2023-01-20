const fs = require("fs");
const path = require("path");

const {
  abi,
} = require("../artifacts/contracts/AddressAttester.sol/AddressAttester.json");

fs.writeFileSync(
  path.join(__dirname, "../abi/AddressAttester.json"),
  JSON.stringify(abi)
);
