import { SparseMerkleTree } from "@unirep/utils";
import { ethers } from "ethers";
import { ATTESTERADD_ADDRESS } from "../config.mjs";
import TransactionManager from "../singletons/TransactionManager.mjs";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const UnirepApp = require("@unirep-app/contracts/artifacts/contracts/AddressAttester.sol/AddressAttester.json");

export default ({ app, db, synchronizer }) => {
  app.post("/api/register", async (req, res) => {
    try {
      // todo: make zkproof setting the leaf at their address index to 1
      // todo: grab address from frontend or somewhere
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
    } catch (error) {
      res.status(500).json({ error });
    }
  });
};
