import { SparseMerkleTree, hash4 } from "@unirep/utils";

export const SMT_DEPTH = 26;
export const SMT_ARITY = 12;

export const defaultSMTLeaf = hash4([0, 0, 0, 0]);
const smt = new SparseMerkleTree(SMT_DEPTH, defaultSMTLeaf, SMT_ARITY);
export const EMPTY_SMT_TREE_ROOT = smt.root.toString();
