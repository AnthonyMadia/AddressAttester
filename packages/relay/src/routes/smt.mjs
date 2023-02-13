import { SparseMerkleTree } from "@unirep/utils";
import { ethers } from "ethers";
import { ATTESTERADD_ADDRESS } from "../config.mjs";
import TransactionManager from "../singletons/TransactionManager.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/AddressAttester.sol/AddressAttester.json");

// initialize incremental merkle tree with depth 26 and arity of 12
const arity = 12;
const depth = 26;
const zeroHash = 0;

const tree = new SparseMerkleTree(depth, zeroHash, arity);
const queue = [];
let isVerifying = false;

export default ({ app, db, synchronizer }) => {
  app.post("/api/register", async (req, res) => {
    try {
      // todo: grab address from frontend or somewhere
      const { ethAddress } = req.body;
      queue.push(ethAddress);
      verifyAddress();
    } catch (error) {
      res.status(500).json({ error });
    }
  });

  async function verifyAddress() {
    if (isVerifying || queue.length === 0) {
      return;
    }

    isVerifying = true;
    const ethAddress = queue.shift();
    // todo: add zk proof here to check if address is in SMT
    // todo: ====
    // add eth address to the SMT
    tree.update(ethAddress, 1);
    // send root to smart contract and post root on chain
    let root = tree.root;
    const appContract = new ethers.Contract(ATTESTERADD_ADDRESS, UnirepApp.abi);
    const calldata = appContract.interface.encodeFunctionData("setRoot", root);
    // send the transaction to the blockchain
    const hash = await TransactionManager.queueTransaction(
      appContract.address,
      calldata
    );

    res.json({ hash });

    isVerifying = false;
    verifyAddress();
  }
};
