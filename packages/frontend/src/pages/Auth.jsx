import React, { useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'
import state from '../contexts/state'

export default observer(() => {
  const navigate = useNavigate()
  const { auth, user } = useContext(state)

  if (user.hasSignedUp) {
    navigate('/')
  }

  return (
    <div className="auth">
      <div className="auth__social">
        <span>Sign in with Github</span>
        <Button onClick={auth.signInWithGithub}>Sign In with Github</Button>
        <span>Sign in with Twitter</span>
        <Button onClick={auth.signInWithTwitter}>Sign In with Twitter</Button>
      </div>
    </div>
  )
})
