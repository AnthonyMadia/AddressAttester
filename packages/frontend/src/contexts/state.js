import { createContext } from 'react'
import Interface from './interface'
import User from './User'
import Address from './address'
import Auth from './auth'

const state = {}

const address = new Address(state)
const auth = new Auth(state)
const ui = new Interface(state)
const user = new User(state)

Object.assign(state, {
  address,
  auth,
  ui,
  user,
})

export default createContext(state)
