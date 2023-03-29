import { schema } from '@unirep/core'
import { nanoid } from 'nanoid'

const _schema = [
  {
    name: 'OAuthState',
    rows: [
      {
        name: 'createdAt',
        type: 'Int',
        default: () => +new Date(),
      },
      ['type', 'String'],
      ['redirectDestination', 'String'],
      ['isSigningUp', 'Bool'],
      ['data', 'String', { optional: true }],
    ],
  },
  {
    name: 'SignupCode',
    rows: [
      ['signupId', 'String'],
      ['usedAt', 'Int', { optional: true }],
      {
        name: 'createdAt',
        type: 'Int',
        default: () => +new Date(),
      },
    ],
  },
  {
    name: 'AccountTransaction',
    primaryKey: 'signedData',
    rows: [
      ['signedData', 'String'],
      ['address', 'String'],
      ['nonce', 'Int'],
    ],
  },
  {
    name: 'AccountNonce',
    primaryKey: 'address',
    rows: [
      ['address', 'String'],
      ['nonce', 'Int'],
    ],
  },
]

// export default [...schema, ..._schema]

export default _schema
  .map((obj) => ({
    ...obj,
    primaryKey: obj.primaryKey || '_id',
    rows: [
      ...obj.rows,
      {
        name: '_id',
        type: 'String',
        default: () => nanoid(),
      },
    ],
  }))
  .concat(schema)
