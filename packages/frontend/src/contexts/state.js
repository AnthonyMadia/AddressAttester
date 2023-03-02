import { createContext } from 'react'
import Interface from './interface'
import User from './User'
import Address from './address'

const state = {}

const address = new Address(state)
const ui = new Interface(state)
const user = new User(state)

Object.assign(state, {
  address,
  ui,
  user,
})

export default createContext(state)
