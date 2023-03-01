import React, { useEffect, useState } from 'react'
import './styles/walletbutton.css'
import state from '../contexts/state'

const WalletButton = ({ setError }) => {
  const address = React.useContext(state)
  const [walletAddress, setWallet] = useState('')

  const connectWallet = async () => {
    if (window.ethereum) {
      // checks if metamask is installed in the browser
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_requestAccounts',
          // Requests an array of account addresses from teh connect Metamask wallet
        })
        const obj = {
          address: addressArray[0],
        }
        return obj
      } catch (error) {
        throw error
      }
    } else {
      throw new Error('Install Metamask')
    }
  }

  const getConnectedWallet = async () => {
    if (window.ethereum) {
      try {
        const addressArray = await window.ethereum.request({
          method: 'eth_accounts',
          // Requests an array of account addresses from the connected MetaMask wallet
        })
        if (addressArray.length > 0) {
          return {
            address: addressArray[0],
            // First, we make sure atleast one address is avaiable and then return the first address in the array
          }
        } else {
          throw new Error(
            'Connect to MetaMask using the connect wallet button.'
          )
          // If there are no addresses in the array, this means MetaMask is installed but the user has not connected their account yet.
        }
      } catch (err) {
        throw err
      }
    } else {
      throw new Error(
        'You must install MetaMask, a virtual Ethereum wallet, in your browser.'
      )
    }
  }

  const walletConnectHandler = async () => {
    try {
      const walletResponse = await connectWallet()
      setWallet(walletAddress.address)
      // add address to address store
      address.setAddress(walletAddress.address)
      setError(null)
    } catch (err) {
      setError(err.message)
    }
  }

  const addWalletListener = () => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts) => {
        // first, listen for an account change event from metamask
        if (accounts.length > 0) {
          setWallet(accounts[0])
          setError(null)
        } else {
          setWallet('')
        }
      })
    } else {
      throw Error('You must install Metamask')
    }
  }

  const load = async () => {
    try {
      const address = await getConnectedWallet()
      setWallet(address)

      addWalletListener()
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
  }, [])

  return (
    <div>
      <button className="wallet-button" onClick={walletConnectHandler}>
        {/* rerender on walletAddress state */}
        {walletAddress && walletAddress.length > 0 ? (
          String(walletAddress).substring(0, 6) +
          '...' +
          String(walletAddress).substring(38)
        ) : (
          <span>Connect Wallet</span>
        )}
      </button>
    </div>
  )
}

export default WalletButton
