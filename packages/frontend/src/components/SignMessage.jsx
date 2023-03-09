import React, { useState } from 'react'
import './styles/signmessage.css'
const { ethers } = require('ethers')
import state from '../contexts/state'

const SignMessage = (props) => {
  const { user, address } = React.useContext(state)
  const messageToSign = async ({ message, setError }) => {
    try {
      if (!window.ethereum)
        setError('Please connect your wallet before signing a message!')
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const signatureHash = await signer.signMessage(message)
      const date = new Date()
      const minutes = date.getMinutes()
      const minutedigit = minutes <= 9 ? '0' + minutes : minutes
      const seconds = date.getSeconds()
      const seconddigit = seconds <= 9 ? '0' + seconds : seconds
      const dateFormat =
        date.toDateString().slice(4) +
        ' ' +
        date.getHours() +
        ':' +
        minutedigit +
        ':' +
        seconddigit
      const timestamp = dateFormat.toString()
      const address = await signer.getAddress()

      return {
        message,
        signatureHash,
        address,
        timestamp,
      }
    } catch (err) {
      console.log(err.message)
    }
  }
  // clicked on form submission
  const signMessageHandler = async (e) => {
    e.preventDefault()
    const entry = new FormData(e.target)
    const sig = await messageToSign({
      message: entry.get('message'),
    })
    if (sig) {
      address.setAddress(sig.address)
      address.setSignature(sig.signatureHash)
      await user.requestReputation({ 0: sig.address }, 0, sig.signatureHash)
      props.onSubmit(sig)
    }
  }

  return (
    <div className="card1">
      <div className="banner-sign">
        <span>Sign Messages</span>
      </div>
      <form
        onSubmit={signMessageHandler} // <--- add pointer here
        className="sign-form"
        id="form-submit"
      >
        <div className="form-title-message">
          <span>Message to sign</span>
        </div>
        <textarea
          className="message-input"
          type="text"
          name="message"
          placeholder="Enter a message here..."
        ></textarea>
      </form>
      <div className="alert-div">
        <button
          className="sign-message-button"
          form="form-submit"
          type="submit"
        >
          <span>Sign Message</span>
        </button>
      </div>
    </div>
  )
}

export default SignMessage
