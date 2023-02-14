const path = require("path");
const Circuit = require("../src").Circuit;
const snarkjs = require("snarkjs");

const buildPath = "../zksnarkBuild";

/**
 * The default prover that uses the circuits in default built folder `zksnarkBuild/`
 */
const defaultProver = {
  /**
   * Generate proof and public signals with `snarkjs.groth16.fullProve`
   * @param circuitName Name of the circuit, which can be chosen from `Circuit`
   * @param inputs The user inputs of the circuit
   * @returns snark proof and public signals
   */
  genProofAndPublicSignals: async (circuitName, inputs) => {
    const circuitWasmPath = path.join(
      __dirname,
      buildPath,
      `${circuitName}.wasm`
    );
    const zkeyPath = path.join(__dirname, buildPath, `${circuitName}.zkey`);
    const result = await snarkjs.groth16.fullProve(
      inputs,
      circuitWasmPath,
      zkeyPath
    );

    return { proof: result.proof, publicSignals: result.publicSignals };
  },

  /**
   * Verify the snark proof and public signals with `snarkjs.groth16.verify`
   * @param circuitName Name of the circuit, which can be chosen from `Circuit`
   * @param publicSignals The snark public signals that is generated from `genProofAndPublicSignals`
   * @param proof The snark proof that is generated from `genProofAndPublicSignals`
   * @returns True if the proof is valid, false otherwise
   */
  verifyProof: async (circuitName, publicSignals, proof) => {
    const vkey = require(path.join(buildPath, `${circuitName}.vkey.json`));
    return snarkjs.groth16.verify(vkey, publicSignals, proof);
  },

  /**
   * Get vkey from default built folder `zksnarkBuild/`
   * @param name Name of the circuit, which can be chosen from `Circuit`
   * @returns vkey of the circuit
   */
  getVKey: async (name) => {
    return require(path.join(buildPath, `${name}.vkey.json`));
  },
};

module.exports = { defaultProver };
