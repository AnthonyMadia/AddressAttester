import { SMT_DEPTH, SMT_ARITY } from "../config/index";

export const ptauName = "powersOfTau28_hez_final_17.ptau";

export const circuitContents = {
  pubKeyMembership: `pragma circom 2.0.0; include "../circuits/eff_ecdsa_membership/pubkey_membership.circom"; \n\ncomponent main { public[ root, Tx, Ty, Ux, Uy ]} = PubKeyMembership(${SMT_DEPTH}, ${SMT_ARITY});`,
  addrMembership: `pragma circom 2.0.0; include "../circuits/eff_ecdsa_membership/addr_membership.circom"; \n\ncomponent component main { public[ root, Tx, Ty, Ux, Uy ]} = AddrMembership(${SMT_DEPTH}, ${SMT_ARITY});`,
};
