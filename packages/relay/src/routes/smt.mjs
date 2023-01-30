import { SparseMerkleTree } from "@unirep/crypto";
import { ethers } from "ethers";
import { ATTESTERADD_ADDRESS } from "../config.mjs";
import TransactionManager from "../singletons/TransactionManager.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/AddressAttester.sol/AddressAttester.json");

// initialize incremental merkle tree with depth 26
const depth = 26;
// initialize sparse merkle tree with depth 4 and zeroHash 0
const zeroHash = 0;

const tree = new SparseMerkleTree(depth, zeroHash);

const appContract = new ethers.Contract(ATTESTERADD_ADDRESS, UnirepApp.abi);
console.log(appContract);

export default ({ app, db, synchronizer }) => {
  app.post("/api/register", async (req, res) => {
    try {
      // todo: grab address from frontend
      // const { ethAddress } = req.body;
      // add eth address to the SMT
      tree.update(ethAddress, 1);
      // send root to smart contract
      let root = tree.root;
      // post root on chain
      const appContract = new ethers.Contract(
        ATTESTERADD_ADDRESS,
        UnirepApp.abi
      );
      const calldata = appContract.interface.encodeFunctionData(
        "setRoot",
        root
      );
    } catch (error) {}
  });
};

// const appContract = new ethers.Contract(ATTESTERADD_ADDRESS, UnirepApp.abi);
// // take eth address and use as data to
// const calldata = appContract.interface.encodeFunctionData("userSignUp", [
//   signupProof.publicSignals,
//   signupProof.proof,
// ]);
// const hash = await TransactionManager.queueTransaction(
//   ATTESTERADD_ADDRESS,
//   calldata
// );
