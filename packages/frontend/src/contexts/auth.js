import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'

import { SERVER } from '../config'

export default class Auth {
  constructor() {
    makeAutoObservable(this)
  }

  async join(platform) {
    console.log('join through', platform)

    // authorization through relay
    const currentUrl = new URL(window.location.href)
    const dest = new URL('/join', currentUrl.origin)

    if (platform === 'twitter') {
      const url = new URL('/api/oauth/twitter', SERVER)
      url.searchParams.set('redirectDestination', dest.toString())
      url.searchParams.set('isSigningUp', true)
      window.location.replace(url.toString())
    }
    if (platform === 'github') {
      const url = new URL('/api/oauth/github', SERVER)
      url.searchParams.set('redirectDestination', dest.toString())
      url.searchParams.set('isSigningUp', true)
      window.location.replace(url.toString())
    }
  }

  async signInWithGithub() {
    try {
      const res = await fetch('/api/auth/github')
      const { url } = await res.json()
      window.location.replace(url)
    } catch (error) {
      console.error(error)
    }
  }

  async signInWithTwitter() {
    try {
      const res = await fetch('/api/auth/twitter')
      const { url } = await res.json()
      window.location.replace(url)
    } catch (error) {
      console.error(error)
    }
  }
}
