import { Prover } from "./circuits";
import { SnarkProof } from "@unirep/utils";
import { BaseProof } from "./BaseProof";
import { BigNumberish } from "@ethersproject/bignumber";
/**
 * The PrivKeyToAddr proof structure that helps to query the public signals
 */
export declare class PrivKeyToAddrProof extends BaseProof {
    readonly idx: {
        addr: number;
    };
    addr: BigNumberish;
    /**
     * @param _publicSignals The public signals of the PrivKeyToAddr proof that can be verified by the prover
     * @param _proof The proof that can be verified by the prover
     * @param prover The prover that can verify the public signals and the proof
     */
    constructor(_publicSignals: BigNumberish[], _proof: SnarkProof, prover?: Prover);
}
