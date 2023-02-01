"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatProofForSnarkjsVerification = exports.formatProofForVerifierContract = exports.Circuit = void 0;
/**
 * Name of the circuits that are used in Unirep protocol
 */
var Circuit;
(function (Circuit) {
    Circuit["PrivKeyToAddrProof"] = "PrivKeyToAddrProof";
})(Circuit = exports.Circuit || (exports.Circuit = {}));
/**
 * Format snark proof for verifier smart contract
 * @param proof The proof of `SnarkProof` type
 * @returns An one dimensional array of stringified proof data
 */
const formatProofForVerifierContract = (proof) => {
    return [
        proof.pi_a[0],
        proof.pi_a[1],
        proof.pi_b[0][1],
        proof.pi_b[0][0],
        proof.pi_b[1][1],
        proof.pi_b[1][0],
        proof.pi_c[0],
        proof.pi_c[1],
    ].map((x) => x.toString());
};
exports.formatProofForVerifierContract = formatProofForVerifierContract;
/**
 * Format an one dimensional array for `snarkjs` verification
 * @param proof The string array of the proof
 * @returns The `SnarkProof` type proof data
 */
const formatProofForSnarkjsVerification = (proof) => {
    return {
        pi_a: [BigInt(proof[0]), BigInt(proof[1]), BigInt("1")],
        pi_b: [
            [BigInt(proof[3]), BigInt(proof[2])],
            [BigInt(proof[5]), BigInt(proof[4])],
            [BigInt("1"), BigInt("0")],
        ],
        pi_c: [BigInt(proof[6]), BigInt(proof[7]), BigInt("1")],
    };
};
exports.formatProofForSnarkjsVerification = formatProofForSnarkjsVerification;
