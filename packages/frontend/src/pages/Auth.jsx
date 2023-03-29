import React, { useEffect, useState, useContext } from 'react'
import { observer } from 'mobx-react-lite'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Button from '../components/Button'

import state from '../contexts/state'

export default observer(() => {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()

  const { auth, user } = useContext(state)

  const [isLoading, setIsLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [idInput, setIdInput] = useState('')

  const signup = async (platform, access_token) => {
    setErrorMsg('')
    setIsLoading(true)
    try {
      await user.signup(platform, access_token)
      await user.getRep(platform)
      return navigate('/user')
    } catch (e) {
      setErrorMsg(e.toString())
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const platform = params.get('platform')
    const access_token = params.get('access_token')
    const signupError = params.get('signupError')
    const isSigningUp = params.get('isSigningUp')
    if (platform && access_token) {
      if (isSigningUp && parseInt(isSigningUp)) {
        signup(platform, access_token)
      } else {
        user.storeAccessToken(platform, access_token)
      }
    } else if (signupError) {
      setErrorMsg(
        `Sign up through ${platform.toUpperCase()} error: ${signupError}`
      )
    }
    setParams('')
  }, [])

  const login = async () => {
    try {
      await user.login(idInput)
      return navigate('/user')
    } catch (e) {
      setErrorMsg(e.toString())
    }
  }

  const onIdInputChange = (event) => {
    setIdInput(event.target.value)
  }

  return (
    <>
      {isLoading ? (
        <div className="join-container">
          <Loader active inline="centered" size="huge" />
          <Link to="/help">Any question?</Link>
        </div>
      ) : (
        <div className="join-container">
          {errorMsg.length > 0 && (
            <Message error header="Oops!" content={errorMsg} />
          )}
          <Button
            basic
            color="blue"
            size="huge"
            onClick={() => auth.join('twitter')}
          >
            <span>Join with Twitter</span>
          </Button>
          <Button
            basic
            color="black"
            size="huge"
            onClick={() => auth.join('github')}
          >
            <span>Join with Github</span>
          </Button>

          <div>Already has account?</div>
        </div>
      )}
    </>
  )
})

{
  /* <Form>
            <TextArea
              placeholder="Please enter your private key."
              style={{ width: '300px' }}
              onChange={onIdInputChange}
            />
          </Form>
          <Button basic size="large" onClick={login}>
            Log in
          </Button>
          <Link to="/help">Any question?</Link> */
}
