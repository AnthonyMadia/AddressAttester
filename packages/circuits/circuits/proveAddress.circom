pragma circom 2.0.0;

include "./unirep/packages/circuits/circuits/circomlib/circuits/poseidon.circom";
include "./unirep/packages/circuits/circuits/incrementalMerkleTree.circom";
include "./unirep/packages/circuits/circuits/leafHasher.circom";

// prove that a user has an address in data0
// and that the address exists in a merkle tree
template ProveAddress(STATE_TREE_DEPTH, EPK_R, FIELD_COUNT, ADDRESS_TREE_DEPTH) {

  signal input state_tree_indices[STATE_TREE_DEPTH];
  signal input state_tree_elements[STATE_TREE_DEPTH];
  signal output state_tree_root;

  signal input address_tree_indices[ADDRESS_TREE_DEPTH];
  signal input address_tree_elements[ADDRESS_TREE_DEPTH];
  signal output address_tree_root;

  signal input identity_secret;

  signal input data[FIELD_COUNT];

  signal input attester_id;
  signal input epoch;

  signal input address;

  signal input sig_data;

  // prove leaf membership in state tree

  component leaf_hasher = StateTreeLeaf(FIELD_COUNT, EPK_R);
  leaf_hasher.identity_secret <== identity_secret;
  leaf_hasher.attester_id <== attester_id;
  leaf_hasher.epoch <== epoch;
  for (var x = 0; x < FIELD_COUNT; x++) {
    leaf_hasher.data[x] <== data[x];
  }

  component merkletree = MerkleTreeInclusionProof(STATE_TREE_DEPTH);
  merkletree.leaf <== leaf_hasher.out;
  for (var i = 0; i < STATE_TREE_DEPTH; i++) {
    merkletree.path_index[i] <== state_tree_indices[i];
    merkletree.path_elements[i] <== state_tree_elements[i];
  }
  state_tree_root <== merkletree.root;

  // prove that address is in data[0]

  component data_0_hasher = Poseidon(2);
  data_0_hasher.inputs[0] <== identity_secret;
  data_0_hasher.inputs[1] <== address;

  data[0] === data_0_hasher.out;

  // prove that address is in address tree

  component addr_merkletree = MerkleTreeInclusionProof(ADDRESS_TREE_DEPTH);
  addr_merkletree.leaf <== address;
  for (var i = 0; i < ADDRESS_TREE_DEPTH; i++) {
    addr_merkletree.path_index[i] <== address_tree_indices[i];
    addr_merkletree.path_elements[i] <== address_tree_elements[i];
  }
  address_tree_root <== addr_merkletree.root;
}
