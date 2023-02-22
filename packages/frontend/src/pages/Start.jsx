import React from 'react'
import { Link } from 'react-router-dom'
import { observer } from 'mobx-react-lite'
import './styles/start.css'
import Tooltip from '../components/Tooltip'
import Button from '../components/Button'

import User from '../contexts/User'

export default observer(() => {
  const userContext = React.useContext(User)

  // if (!userContext.userState) {
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
          {!userContext.hasSignedUp ? (
            <Button
              onClick={() => {
                if (!userContext.userState) return
                return userContext.signup()
              }}
            >
              {userContext.userState ? 'Join' : 'Initializing...'}
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
              <Link to="/dashboard">
                <Button>
                  Dashboard
                  <span style={{ marginLeft: '12px' }}>
                    <img
                      src={require('../../public/arrow.svg')}
                      alt="right arrow"
                    />
                  </span>
                </Button>
              </Link>
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

// userContext.signup()
// <Button onClick={() => userContext.signup()}>Join<span style={{marginLeft: '12px'}}><img src={require('../../public/arrow.svg')} alt="right arrow"/></span></Button>
