import { createContext } from 'react'
import { makeAutoObservable } from 'mobx'

export default class Auth {
  constructor() {
    makeAutoObservable(this)
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
