import React from 'react'
import Button from './Button'
import './styles/generatedsignatures.css'

import state from '../contexts/state'

const ProveAddress = () => {
  const { address, user } = React.useContext(state)

  return (
    <div className="card-long">
      <div className="ust">
        <h3>
          To prove reputation/address, you must transition to the next epoch
        </h3>
        <Button onClick={() => user.stateTransition()}>Transition</Button>
      </div>

      <div className="info-item">
        <h3>Latest Reputation</h3>
      </div>

      {user.data.map((data, i) => {
        return (
          <div key={i} className="info-item">
            <div>Data {i}</div>
            <div className="stat">{(data || 0).toString()}</div>
          </div>
        )
      })}
      <div className="labels">
        <span>Prove address</span>
      </div>
      <Button onClick={() => user.proveReputation()}>Prove Address</Button>
    </div>
  )
}

export default ProveAddress
