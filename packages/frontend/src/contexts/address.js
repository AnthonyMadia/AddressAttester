import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'
import { SERVER } from '../config'

export default class Address {
  hasSignedUp = false
  address = null
  signature = null

  constructor() {
    makeAutoObservable(this)
    this.load()
  }
  async load() {}

  setAddress(address) {
    this.address = address
    console.log(this.address)
  }

  setSignature(signature) {
    this.signature = signature
    console.log(this.signature)
  }

  // prove control of an address and sign some text
  async proveAddressData() {
    const addrIndex = this.addressIndex(BigInt(this.address))
    if (addrIndex === -1) {
      throw new Error('You are not authorized to chat here')
    }
    const addressTreeProof = this.addressTree.createProof(addrIndex)
    // // take the upper 250 bits to fit into a bn128 field element
    // const hash = ethers.utils.keccak256(
    //   '0x' + Buffer.from(text, 'utf8').toString('hex')
    // )
    // todo: we have signatures hash already from signing a message
    const sig_data = BigInt(signature) >> BigInt(6)
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
