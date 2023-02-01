export const ptauName = "powersOfTau28_hez_final_17.ptau";

export const circuitContents = {
  // todo: figure out the correct inputs
  privkeyToAddr: `pragma circom 2.0.0; include "../circuits/eth_addr.circom"; \n\ncomponent main { public [ start_root ] } = AggregateEpochKeys(${EPOCH_TREE_DEPTH}, ${EPOCH_TREE_ARITY}, ${AGGREGATE_KEY_COUNT});`,
};
