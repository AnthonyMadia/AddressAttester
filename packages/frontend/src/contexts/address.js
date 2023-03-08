import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { SERVER, provider } from '../config'
import { ZkIdentity, Strategy, F, IncrementalMerkleTree } from '@unirep/utils'
import { UserState } from '@unirep/core'
import { SECP256K1_N, getPointPreComputes, splitToRegisters } from '../utils/ec'
import prover from './prover'
import elliptic from 'elliptic'
import BN from 'bn.js'
import poseidon from 'poseidon-lite'

export default class Address {
  id = null
  address = null
  signature = null
  // todo: create tree
  // addressTree = null

  constructor(state) {
    makeAutoObservable(this)
    this.state = state
    this.load()
  }
  async load() {}

  // addressIndex(addr) {
  //   if (!this.addressTree) return -1
  //   return this.addressTree._nodes[0].indexOf(BigInt(addr))
  // }

  setAddress(address) {
    this.address = address
    console.log(this.address)
  }

  setSignature(signature) {
    console.log('logging signature coming in', signature) //these match :thumbsUp
    this.signature = signature
    console.log('logging this.signature', this.signature)
  }

  async setIdentity() {
    const {
      default: { sha512 },
    } = await import(/* webpackPrefetch: true */ 'js-sha512')
    const h = sha512(sig).padStart(128, '0')
    const nullifier = BigInt('0x' + h.slice(0, 64)) >> BigInt(6)
    const trapdoor = BigInt('0x' + h.slice(64)) >> BigInt(6)
    this.id = new ZkIdentity(0)
    this.id._identityTrapdoor = trapdoor
    this.id._identityNullifier = nullifier
    this.id._secret = [nullifier, trapdoor]
  }

  // prove control of an address and sign some text - need offchain tree for this
  async proveAddressData() {
    console.log('logging address in proveAddressData()', this.address)
    const addrIndex = this.addressIndex(BigInt(this.address))
    if (addrIndex === -1) {
      throw new Error('-1 for addr index')
    }
    const addressTreeProof = this.addressTree.createProof(addrIndex)

    const sig_data = BigInt(this.signature) >> BigInt(6)
    const data = await this.userState.getData()
    const stateTree = await this.userState.sync.genStateTree(0)
    const index = await this.userState.latestStateTreeLeafIndex()
    const stateTreeProof = stateTree.createProof(index)
    const inputs = {
      sig_data,
      attester_id: APP_ADDRESS,
      identity_secret: this.id.secretHash,
      data,
      epoch: 0,
      address: this.address,
      state_tree_elements: stateTreeProof.siblings,
      state_tree_indices: stateTreeProof.pathIndices,
      address_tree_elements: addressTreeProof.siblings,
      address_tree_indices: addressTreeProof.pathIndices,
    }
    console.time('Message proof time')
    const { proof, publicSignals } = await prover.genProofWithCache(
      'proveAddress',
      inputs
    )
    console.timeEnd('Message proof time')
    return { publicSignals, proof }
  }
}
