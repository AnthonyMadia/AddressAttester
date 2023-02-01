import { Circuit, Prover } from "./circuits";
import { SnarkProof } from "@unirep/utils";
import { BigNumberish } from "@ethersproject/bignumber";
/**
 * The basic proof structure that is used in unirep protocol
 */
export declare class BaseProof {
    readonly _snarkProof: SnarkProof;
    protected circuit?: Circuit;
    readonly publicSignals: BigNumberish[];
    proof: BigNumberish[];
    prover?: Prover;
    /**
     * @param publicSignals The public signals of the proof that can be verified by the prover
     * @param proof The proof that can be verified by the prover
     * @param prover The prover that can verify the public signals and the proof
     */
    constructor(publicSignals: BigNumberish[], proof: SnarkProof | BigNumberish[], prover?: Prover);
    /**
     * Call the `verifyProof` function in the prover that verifies the proof.
     * @returns True if the proof is valid, false otherwise
     */
    verify(): Promise<boolean>;
    /**
     * Proof hash is used to find the proof index in the smart contract.
     * A submitted proof can obtain a proof index and a unique hash value
     * @returns A `keccak256` hash value of public signals and proof
     */
    hash(): string;
}
