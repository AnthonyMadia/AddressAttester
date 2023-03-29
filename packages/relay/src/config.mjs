import { ethers } from 'ethers'
import _config from '../../../config.js'
import { config } from 'dotenv'
config()

export const UNIREP_ADDRESS =
  process.env.UNIREP_ADDRESS ?? _config.UNIREP_ADDRESS
export const ADDRESS_ADDRESS =
  process.env.ADDRESS_ADDRESS ?? _config.ADDRESS_ADDRESS
export const ETH_PROVIDER_URL =
  process.env.ETH_PROVIDER_URL ?? _config.ETH_PROVIDER_URL
export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? _config.PRIVATE_KEY

export const DB_PATH = process.env.DB_PATH ?? ':memory:'

export const provider = ETH_PROVIDER_URL.startsWith('http')
  ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
  : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL)

export const TWITTER_CLIENT_ID = process.env.TWITTER_CLIENT_ID ?? ''
export const TWITTER_REDIRECT_URI = process.env.TWITTER_REDIRECT_URI ?? ''
export const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID ?? ''
export const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET ?? ''
export const GITHUB_REDIRECT_URI = process.env.GITHUB_REDIRECT_URI ?? ''
