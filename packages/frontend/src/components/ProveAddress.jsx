import React from 'react'
import './styles/generatedsignatures.css'

const ProveAddress = () => {
  return (
    <div className="card-long">
      <div className="labels">
        <span>Prove address</span>
      </div>
      <h1>Making a proof here: prove address like zketh</h1>
      {/* <div className="action-container">
            <div className="icon">
              <h2>Prove Reputation</h2>
              <Tooltip text="Users can prove they control some amount of reputation without revealing exactly how much they control." />
            </div>
            <p>Minimum reputation:</p>
            <input
              value={repProofInputs.minRep ?? ''}
              onChange={(event) => {
                if (!/^\d*$/.test(event.target.value)) return
                setRepProofInputs((v) => ({
                  ...v,
                  minRep: event.target.value ?? 0,
                }))
              }}
            />
          </div> */}
    </div>
  )
}

export default ProveAddress
