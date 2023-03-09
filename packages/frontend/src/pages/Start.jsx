import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './styles/start.css'
import Tooltip from '../components/Tooltip'
import Button from '../components/Button'

import state from '../contexts/state'

export default observer(() => {
  const { user } = React.useContext(state)

  // if (!user.userState) {
  //     return (
  //     <div className="container">
  //         Loading...
  //     </div>
  //     )
  // }

  return (
    <>
      <div className="bg">
        <img
          src={require('../../public/hummingbird.svg')}
          alt="hummingbird at a flower"
        />
      </div>
      <div className="content">
        <p>
          Click 'Join' to sign up to the Address Attester's membership group.
        </p>
        <div className="join">
          {!user.hasSignedUp ? (
            <Button
              onClick={() => {
                if (!user.userState) return
                return user.signup()
              }}
            >
              {user.userState ? 'Join' : 'Initializing...'}
              <span style={{ marginLeft: '12px' }}>
                <img
                  src={require('../../public/arrow.svg')}
                  alt="right arrow"
                />
              </span>
            </Button>
          ) : (
            <div>
              <p style={{ fontWeight: '400', lineHeight: '.5em' }}>
                USER ADDED!
              </p>
              <Link to="/address">
                <Button>
                  Claim an address
                  <span style={{ marginLeft: '12px' }}>
                    <img
                      src={require('../../public/arrow.svg')}
                      alt="right arrow"
                    />
                  </span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  )
})
