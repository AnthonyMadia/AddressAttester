import React, { useState, useContext, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import { observer } from 'mobx-react-lite'

import './styles/address.css'
import SignMessage from '../components/SignMessage.jsx'
import VerifySignature from '../components/VerifySignature'
import ProveAddress from '../components/ProveAddress'
import GeneratedSignatures from '../components/GeneratedSignatures'
import WalletButton from '../components/WalletButton'
import ErrorMessage from '../components/ErrorMessage'

import User from '../contexts/User'

const INITIAL_SIGNATURES = [
  {
    message: 'Example signed message',
    signatureHash:
      '0xddd2d40ef499a0ebffdfcffathisisanexamplehash016ec3136f63b112515ad89c335bd5afa8c021013d657aaae7266bb2c5c982db24f7adad1b',
    address: '0x5DAAC14781a5C4AF2B0673467364Cba46Da935dB',
    timestamp: 'Jan 3 2009 10:39:55',
  },
]

export default observer(() => {
  const [signatures, setSignatures] = useState(INITIAL_SIGNATURES)
  const [error, setError] = useState(null)
  const navigate = useNavigate()
  const { user } = React.useContext(state)

  const sigToArrHandler = (sigData) => {
    setSignatures((prevSignatures) => {
      return [sigData, ...prevSignatures]
    })
  }

  const handleBack = () => {
    navigate('/')
  }

  return (
    <div className="App">
      <button className="back-button" onClick={handleBack}>
        Back
      </button>
      <ErrorMessage message={error} />
      <div className="banner">
        <div className="banner-container">
          <div className="title">
            <span>Address Attester Signature Generator/Verifier</span>
          </div>
          <WalletButton setError={setError} />
        </div>
      </div>
      <div className="main-container">
        <div className="upper-container">
          <SignMessage onSubmit={sigToArrHandler} setError={setError} />
          <VerifySignature signatures={signatures} />
        </div>
        <div className="lower-container">
          <ProveAddress signatures={signatures} />
        </div>
        <div className="lower-container">
          <GeneratedSignatures signatures={signatures} />
        </div>
      </div>
    </div>
  )
})
