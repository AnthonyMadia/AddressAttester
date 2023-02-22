import { Synchronizer } from '@unirep/core'
import {
  provider,
  UNIREP_ADDRESS,
  DB_PATH,
  ADDRESS_ADDRESS,
} from '../config.mjs'
import { SQLiteConnector } from 'anondb/node.js'
import prover from './prover.mjs'
import schema from './schema.mjs'

const db = await SQLiteConnector.create(schema, DB_PATH ?? ':memory:')
export default new Synchronizer({
  db,
  provider,
  unirepAddress: UNIREP_ADDRESS,
  attesterId: ADDRESS_ADDRESS,
  prover,
})
