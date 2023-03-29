import {
  GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET,
  TWITTER_CLIENT_ID,
  TWITTER_REDIRECT_URI,
  GITHUB_REDIRECT_URI,
} from '../config.mjs'
import fetch from 'node-fetch'
import crypto from 'crypto'

export default ({ app, db, synchronizer }) => {
  app.get('/api/oauth/github', async (req, res) => {
    try {
      await githubAuth(req, res, db)
    } catch (e) {
      console.log('github auth error:', e)
      res.status(500).json({
        message: 'Uncaught error',
        info: e.toString(),
      })
    }
  })
  app.get('/api/oauth/github/callback', async (req, res) => {
    try {
      await completeGithubAuth(req, res, db)
    } catch (e) {
      console.log('github callback error:', e)
      res.status(500).json({
        message: 'Uncaught error',
        info: e.toString(),
      })
    }
  })
  app.get('/api/oauth/twitter', async (req, res) => {
    try {
      await twitterAuth(req, res, db)
    } catch (e) {
      console.log('twitter auth error:', e)
      res.status(500).json({
        message: 'Uncaught error',
        info: e.toString(),
      })
    }
  })
  app.get('/api/oauth/twitter/callback', async (req, res) => {
    try {
      await completeTwitterAuth(req, res, db)
    } catch (e) {
      console.log('twitter callback error:', e)
      res.status(500).json({
        message: 'Uncaught error',
        info: e.toString(),
      })
    }
  })
}

async function twitterAuth(req, res, db) {
  const challenge = crypto.randomBytes(32).toString('hex')
  const _state = await db.create('OAuthState', {
    type: 'twitter',
    data: challenge,
    redirectDestination: req.query.redirectDestination,
    isSigningUp: req.query.isSigningUp === 'true',
  })

  const url = new URL('https://twitter.com/i/oauth2/authorize')
  url.searchParams.append('response_type', 'code')
  url.searchParams.append('client_id', TWITTER_CLIENT_ID)
  url.searchParams.append('redirect_uri', TWITTER_REDIRECT_URI)
  url.searchParams.append('scope', 'users.read tweet.read offline.access')
  url.searchParams.append('state', _state._id)
  // this PKCE thing seems stupid
  url.searchParams.append('code_challenge', challenge)
  url.searchParams.append('code_challenge_method', 'plain')
  res.redirect(url.toString())
}

async function completeTwitterAuth(req, res, db) {
  const { state, code, error } = req.query
  const _state = await db.findOne('OAuthState', {
    where: { _id: state },
  })
  if (!_state) {
    res.status(401).json({
      error: 'Invalid state',
    })
    return
  }
  await db.delete('OAuthState', {
    where: {
      _id: state,
    },
  })

  if (error) {
    // access was denied
    const url = new URL(_state.redirectDestination)
    url.searchParams.append(
      'signupError',
      'There was a problem authenticating you'
    )
    url.searchParams.append('platform', 'twitter')
    res.redirect(url.toString())
    return
  }
  const args = {
    code,
    grant_type: 'authorization_code',
    client_id: TWITTER_CLIENT_ID,
    code_verifier: _state.data,
    redirect_uri: TWITTER_REDIRECT_URI,
  }
  const body = Object.entries(args)
    .map(([key, val]) => `${key}=${encodeURIComponent(val)}`)
    .join('&')
  const auth = await fetch('https://api.twitter.com/2/oauth2/token', {
    method: 'POST',
    body,
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
    },
  }).then((r) => r.json())
  console.log(auth)
  const user = await fetch('https://api.twitter.com/2/users/me', {
    headers: {
      authorization: `Bearer ${auth.access_token}`,
    },
  }).then((r) => r.json())
  console.log(user)
  if (!user.data.id) {
    const url = new URL(_state.redirectDestination)
    url.searchParams.append('signupError', 'Unknown problem')
    url.searchParams.append('platform', 'twitter')
    res.redirect(url.toString())
    return
  }
  // end oauth logic
  // generate a signup code and give it to the user
  // prevent double signup
  const url = new URL(_state.redirectDestination)
  if (_state.isSigningUp) {
    const signupId = `twitter-${user.data.id}`
    const existingSignup = await db.findOne('SignupCode', {
      where: {
        signupId,
      },
    })
    if (existingSignup || existingSignup?.usedAt) {
      url.searchParams.append(
        'signupError',
        'You have already signed up with this account'
      )
      url.searchParams.append('platform', 'twitter')
      res.redirect(url.toString())
      return
    }
    await db.create('SignupCode', {
      signupId,
    })
  }

  // now go back to the frontend signup flow
  url.searchParams.append('platform', 'twitter')
  url.searchParams.append('access_token', auth.access_token)
  url.searchParams.append('isSigningUp', _state.isSigningUp)
  res.redirect(url.toString())
}

async function githubAuth(req, res, db) {
  // no need to PKCE
  const state = await db.create('OAuthState', {
    type: 'github',
    redirectDestination: req.query.redirectDestination,
    isSigningUp: req.query.isSigningUp === 'true',
  })
  const url = new URL('https://github.com/login/oauth/authorize')
  url.searchParams.append('client_id', GITHUB_CLIENT_ID)
  url.searchParams.append('redirect_uri', GITHUB_REDIRECT_URI)
  url.searchParams.append('state', state._id)
  url.searchParams.append('allow_signup', 'false')
  res.redirect(url.toString())
}

async function completeGithubAuth(req, res, db) {
  const { code, state, error } = req.query
  const _state = await db.findOne('OAuthState', {
    where: { _id: state },
  })
  if (!_state) {
    res.status(401).json({
      error: 'Invalid state',
    })
    return
  }
  await db.delete('OAuthState', {
    where: {
      _id: state,
    },
  })
  if (error) {
    // access was denied
    const url = new URL(_state.redirectDestination)
    url.searchParams.append(
      'signupError',
      'There was a problem authenticating you'
    )
    url.searchParams.append('platform', 'github')
    res.redirect(url.toString())
    return
  }
  const url = new URL('https://github.com/login/oauth/access_token')
  url.searchParams.append('client_id', GITHUB_CLIENT_ID)
  url.searchParams.append('client_secret', GITHUB_CLIENT_SECRET)
  url.searchParams.append('code', code)
  const auth = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      accept: 'application/json',
    },
  })
  const { access_token, scope, token_type } = await auth.json()
  const user = await fetch('https://api.github.com/user', {
    headers: {
      authorization: `token ${access_token}`,
    },
  }).then((r) => r.json())
  if (!user.id) {
    const _url = new URL(_state.redirectDestination)
    _url.searchParams.append('signupError', 'Unknown problem')
    _url.searchParams.append('platform', 'github')
    res.redirect(_url.toString())
    return
  }
  // end oauth logic
  const _url = new URL(_state.redirectDestination)
  if (_state.isSigningUp) {
    const signupId = `github-${user.id}`
    const existingSignup = await db.findOne('SignupCode', {
      where: {
        signupId,
      },
    })
    if (existingSignup || existingSignup?.usedAt) {
      _url.searchParams.append(
        'signupError',
        'You have already signed up with this account'
      )
      _url.searchParams.append('platform', 'github')
      res.redirect(_url.toString())
      return
    }
    await db.create('SignupCode', {
      signupId,
    })
  }

  // now go back to the frontend signup flow
  _url.searchParams.append('platform', 'github')
  _url.searchParams.append('access_token', access_token)
  _url.searchParams.append('isSigningUp', _state.isSigningUp)
  res.redirect(_url.toString())
}
