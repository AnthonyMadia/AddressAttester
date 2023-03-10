import { ethers } from 'ethers'
import { SignupProof } from '@unirep/circuits'
import { ADDRESS_ADDRESS } from '../config.mjs'
import TransactionManager from '../singletons/TransactionManager.mjs'
import { createRequire } from 'module'
const require = createRequire(import.meta.url)
const AddressAttester = require('@unirep-app/contracts/artifacts/contracts/AddressAttester.sol/AddressAttester.json')

export default ({ app, db, synchronizer }) => {
  app.post('/api/signup', async (req, res) => {
    try {
      const { publicSignals, proof } = req.body
      const signupProof = new SignupProof(
        publicSignals,
        proof,
        synchronizer.prover
      )

      const valid = await signupProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      const currentEpoch = synchronizer.calcCurrentEpoch()
      if (currentEpoch !== Number(BigInt(signupProof.epoch))) {
        res.status(400).json({ error: 'Wrong epoch' })
        return
      }
      const appContract = new ethers.Contract(
        ADDRESS_ADDRESS,
        AddressAttester.abi
      )
      const calldata = appContract.interface.encodeFunctionData('userSignUp', [
        signupProof.publicSignals,
        signupProof.proof,
      ])
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
