import { ethers } from 'ethers'
import { EpochKeyProof } from '@unirep/circuits'
import { ADDRESS_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const AddressAttester = require('@unirep-app/contracts/artifacts/contracts/AddressAttester.sol/AddressAttester.json')

export default ({ app, db, synchronizer }) => {
  app.post('/api/request', async (req, res) => {
    try {
      const { reqData, signature, publicSignals, proof } = req.body

      // proof over epoch key is needed before submitting an attestation
      const epochKeyProof = new EpochKeyProof(
        publicSignals,
        proof,
        synchronizer.prover
      )
      const valid = await epochKeyProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      const epoch = await synchronizer.loadCurrentEpoch()

      const appContract = new ethers.Contract(
        ADDRESS_ADDRESS,
        AddressAttester.abi
      )
      // call isValidSignature to verify signer & signature on-chain
      const addrCalldata = appContract.interface.encodeFunctionData(
        'isValidSignature',
        [reqData[0], signature]
      )
      const addrHash = await TransactionManager.queueTransaction(
        ADDRESS_ADDRESS,
        addrCalldata
      )

      const keys = Object.keys(reqData)
      let calldata
      if (keys.length === 1) {
        console.log('first condition', reqData[keys[0]])
        calldata = appContract.interface.encodeFunctionData(
          'submitAttestation',
          [epochKeyProof.epochKey, epoch, keys[0], reqData[keys[0]]]
        )
      } else if (keys.length > 1) {
        calldata = appContract.interface.encodeFunctionData(
          'submitManyAttestations',
          [epochKeyProof.epochKey, epoch, keys, keys.map((k) => reqData[k])]
        )
      }

      const hash = await TransactionManager.queueTransaction(
        ADDRESS_ADDRESS,
        calldata
      )

      res.json({ hash })
    } catch (error) {
      res.status(500).json({ error })
    }
  })
}
