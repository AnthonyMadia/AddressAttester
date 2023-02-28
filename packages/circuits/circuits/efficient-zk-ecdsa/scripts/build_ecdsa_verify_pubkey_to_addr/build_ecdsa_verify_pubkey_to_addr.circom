pragma circom 2.0.6;
include "../../circuits/ecdsa_verify_pubkey_to_addr.circom";
component main { public [TPreComputes, m] } = ECDSAVerifyPubKeyToAddr(64, 4);
