"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrivKeyToAddrProof = void 0;
const circuits_1 = require("./circuits");
const BaseProof_1 = require("./BaseProof");
/**
 * The PrivKeyToAddr proof structure that helps to query the public signals
 */
class PrivKeyToAddrProof extends BaseProof_1.BaseProof {
    /**
     * @param _publicSignals The public signals of the PrivKeyToAddr proof that can be verified by the prover
     * @param _proof The proof that can be verified by the prover
     * @param prover The prover that can verify the public signals and the proof
     */
    constructor(_publicSignals, _proof, prover) {
        super(_publicSignals, _proof, prover);
        this.idx = {
            addr: 0,
        };
        this.addr = _publicSignals[this.idx.addr];
        this.circuit = circuits_1.Circuit.PrivKeyToAddrProof;
    }
}
exports.PrivKeyToAddrProof = PrivKeyToAddrProof;
