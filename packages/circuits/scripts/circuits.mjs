import { SMT_DEPTH, SMT_ARITY } from "../config/index";

export const ptauName = "powersOfTau28_hez_final_17.ptau";

// Provided circuits have Merkle tree depth = 20 ! Our tree here will be depth of 

export const circuitContents = {
  // todo: figure out the correct inputs
  // need SMT proof, and spartan ecdsa proof(s) - not sure
  efficientECDSAToAddr: `pragma circom 2.0.0; include "../circuits/eff_ecdsa_membership/eff_ecdsa_to_addr.circom"; \n\ncomponent main { public [ start_root ] } = AggregateEpochKeys(${EPOCH_TREE_DEPTH}, ${EPOCH_TREE_ARITY}, ${AGGREGATE_KEY_COUNT});`,
  privkeyToAddr: `pragma circom 2.0.0; include "../circuits/eth_addr.circom"; \n\ncomponent main { public [ start_root ] } = AggregateEpochKeys(${EPOCH_TREE_DEPTH}, ${EPOCH_TREE_ARITY}, ${AGGREGATE_KEY_COUNT});`,
};
