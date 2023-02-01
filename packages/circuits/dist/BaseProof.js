"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseProof = void 0;
const circuits_1 = require("./circuits");
const solidity_1 = require("@ethersproject/solidity");
/**
 * The basic proof structure that is used in unirep protocol
 */
class BaseProof {
    /**
     * @param publicSignals The public signals of the proof that can be verified by the prover
     * @param proof The proof that can be verified by the prover
     * @param prover The prover that can verify the public signals and the proof
     */
    constructor(publicSignals, proof, prover) {
        if (Array.isArray(proof)) {
            // assume it's formatted for verifier contract
            this.proof = proof;
            this._snarkProof = (0, circuits_1.formatProofForSnarkjsVerification)(proof.map((p) => p.toString()));
        }
        else if (typeof proof === "object") {
            // assume it's a SnarkProof
            const formattedProof = (0, circuits_1.formatProofForVerifierContract)(proof);
            this._snarkProof = proof;
            this.proof = formattedProof;
        }
        else {
            throw new Error("Invalid proof supplied");
        }
        this.publicSignals = publicSignals;
        this.prover = prover;
    }
    /**
     * Call the `verifyProof` function in the prover that verifies the proof.
     * @returns True if the proof is valid, false otherwise
     */
    async verify() {
        if (!this.prover) {
            throw new Error("No prover set");
        }
        if (!this.circuit) {
            throw new Error("No circuit specified");
        }
        return this.prover.verifyProof(this.circuit, this.publicSignals.map((n) => BigInt(n.toString())), this._snarkProof);
    }
    /**
     * Proof hash is used to find the proof index in the smart contract.
     * A submitted proof can obtain a proof index and a unique hash value
     * @returns A `keccak256` hash value of public signals and proof
     */
    hash() {
        return (0, solidity_1.keccak256)(["uint256[]", "uint256[8]"], [this.publicSignals, this.proof]);
    }
}
exports.BaseProof = BaseProof;
