import { KEY_SERVER } from "../config";
import { Circuit } from "@unirep/circuits";
import { SnarkPublicSignals, SnarkProof } from "@unirep/utils";

export default {
  verifyProof: async (circuitName, publicSignals, proof) => {
    const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
    const url = new URL(`${circuitName}.vkey.json`, KEY_SERVER);
    const vkey = await fetch(url.toString()).then((r) => r.json());
    return snarkjs.groth16.verify(vkey, publicSignals, proof);
  },
  genProofAndPublicSignals: async (circuitName, inputs) => {
    const snarkjs = await import(/* webpackPrefetch: true */ "snarkjs");
    const wasmUrl = new URL(`${circuitName}.wasm`, KEY_SERVER);
    const zkeyUrl = new URL(`${circuitName}.zkey`, KEY_SERVER);
    const [wasm, zkey] = await Promise.all([
      fetch(wasmUrl.toString()).then((r) => r.arrayBuffer()),
      fetch(zkeyUrl.toString()).then((r) => r.arrayBuffer()),
    ]);
    const { proof, publicSignals } = await snarkjs.groth16.fullProve(
      inputs,
      new Uint8Array(wasm),
      new Uint8Array(zkey)
    );
    return { proof, publicSignals };
  },
};
