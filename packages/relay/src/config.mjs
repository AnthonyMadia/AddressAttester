import { ethers } from "ethers";
import { config } from "dotenv";
config();

export const UNIREP_ADDRESS =
  process.env.UNIREP_ADDRESS ?? "0xB69426AC9537623B7c69622b8dfF6058D9D78b6c";
export const ADDRESS_ADDRESS =
  process.env.ADDRESS_ADDRESS ?? "0xa51c1fc2f0d1a1b8494ed1fe312d7c3a78ed91c0";
// export const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL ?? 'https://arbitrum.goerli.unirep.io'
export const ETH_PROVIDER_URL =
  process.env.ETH_PROVIDER_URL ?? "http://localhost:8545";
export const PRIVATE_KEY =
  process.env.PRIVATE_KEY ??
  "0x4fba49cf81efd3609744b42bfaafbd1fa55b381ee9de06045677842cf38ee940";
// export const PRIVATE_KEY = process.env.PRIVATE_KEY ?? '0x0f70e777f814334daa4456ac32b9a1fdca75ae07f70c2e6cef92679bad06c88b'

export const DB_PATH = process.env.DB_PATH ?? ":memory:";

export const provider = ETH_PROVIDER_URL.startsWith("http")
  ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
  : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL);
