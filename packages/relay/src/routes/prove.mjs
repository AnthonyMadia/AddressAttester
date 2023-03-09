import { UserStateTransitionProof, ReputationProof } from '@unirep/circuits'
import TransactionManager from '../singletons/TransactionManager.mjs'

export default ({ app, db, synchronizer }) => {
  app.post('/api/prove', async (req, res) => {
    try {
      const { publicSignals, proof } = req.body
      const reputationProof = new ReputationProof(
        publicSignals,
        proof,
        synchronizer.prover
      )
      const valid = await reputationProof.verify()
      if (!valid) {
        res.status(400).json({ error: 'Invalid proof' })
        return
      }
      // todo: what function needs to be defined on this
      const calldata = synchronizer.unirepContract.interface.encodeFunctionData(
        'verifyReputationProof',
        [reputationProof.publicSignals, reputationProof.proof]
      )
      const hash = await TransactionManager.queueTransaction(
        synchronizer.unirepContract.address,
        calldata
      )
      res.json({ hash })
    } catch (error) {
      res.status(500).json({ error })
    }
  })
}
