import fs from 'fs'
import path from 'path'
import url from 'url'
import { createRequire } from 'module'
import { deployUnirep } from '@unirep/contracts/deploy'
import hardhat from 'hardhat'
const { ethers } = hardhat

const require = createRequire(import.meta.url)
const __dirname = path.dirname(url.fileURLToPath(import.meta.url))

const UnirepApp = require('../abi/AddressAttester.json')

const [signer] = await ethers.getSigners()
const unirep = await deployUnirep(signer)
const epochLength = 100

const App = await ethers.getContractFactory('AddressAttester')
const app = await App.deploy(unirep.address, epochLength)

await app.deployed()

console.log(
  `AddressAttester with epoch length ${epochLength} deployed to ${app.address} with Unirep instance ${unirep.address}`
)

const config = `module.exports = {
  UNIREP_ADDRESS: '${unirep.address}',
  ADDRESS_ADDRESS: '${app.address}',
  ETH_PROVIDER_URL: '${hardhat.network.config.url ?? ''}',
  ${
    Array.isArray(hardhat.network.config.accounts)
      ? `PRIVATE_KEY: '${hardhat.network.config.accounts[0]}',`
      : `/**
    This contract was deployed using a mnemonic. The PRIVATE_KEY variable needs to be set manually
  **/`
  }
}
`

const configPath = path.join(__dirname, '../../../config.js')
await fs.promises.writeFile(configPath, config)

console.log(`Config written to ${configPath}`)
