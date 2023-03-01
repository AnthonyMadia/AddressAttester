import { CircuitConfig } from '@unirep/circuits'
import { EPK_R, OMT_R } from '@unirep/utils'
const { FIELD_COUNT } = CircuitConfig.default

const STATE_TREE_DEPTH = 17
const ADDRESS_TREE_DEPTH = 17

export const ptauName = 'powersOfTau28_hez_final_20.ptau'

export const circuitContents = {
  proveAddress: `pragma circom 2.0.0; include "../circuits/proveAddress.circom"; \n\ncomponent main { public [ attester_id, epoch, sig_data ] } = ProveAddress(${STATE_TREE_DEPTH}, ${EPK_R}, ${FIELD_COUNT}, ${ADDRESS_TREE_DEPTH});`,
}
