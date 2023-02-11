pragma circom 2.1.2;

include "./eff_ecdsa.circom";
include "./sparseMerkleTree.circom";
include "../circomlib/circuits/poseidon.circom";


/**
 *  PubkeyMembership
 *  ================
 *  
 *  Checks that an inputted efficient ECDSA signature (definition and discussion 
 *  can be found at https://personaelabs.org/posts/efficient-ecdsa-1/) 
 *  is signed by a public key that is in a Merkle tree of public keys. Avoids the
 *  SNARK-unfriendly Keccak hash that must be performed when validating if the 
 *  public key is in a Merkle tree of addresses.
 */

 // NOTE: using SMT proofs here. Review if siblings input is needed

// I would like to prove that an address is in a SMT of addresses where the 
// addresses are the index and the value is either 0 if the address has
// not registered or 1 if it is



template PubKeyMembership(HEIGHT, ARITY) {
    signal input s;
    signal input root;
    signal input Tx; 
    signal input Ty; 
    signal input Ux;
    signal input Uy;
    signal input path_elements[HEIGHT][ARITY];
    // signal input siblings[nLevels];

    component ecdsa = EfficientECDSA();
    ecdsa.Tx <== Tx;
    ecdsa.Ty <== Ty;
    ecdsa.Ux <== Ux;
    ecdsa.Uy <== Uy;
    ecdsa.s <== s;

    component pubKeyHash = Poseidon();
    pubKeyHash.inputs[0] <== ecdsa.pubKeyX;
    pubKeyHash.inputs[1] <== ecdsa.pubKeyY;

    component merkletree = SMTInclusionProof(HEIGHT, ARITY);
    merkletree.leaf_index <== pubToAddr.address;
    merkletree.leaf <== ;

    for (var i = 0; i < HEIGHT; i++) {
        for (var j = 0; j < ARITY; j++) {
            merkletree.path_elements[i][j] <== path_elements[i][j];
        }
    }

    root === merkletree.root;
}

// need to figure out value of leaf and final constraint
// not sure we need siblings value