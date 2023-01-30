import { ethers } from "ethers";
import { config } from "dotenv";
config();

// add ?? condition
export const UNIREP_ADDRESS = process.env.UNIREP_ADDRESS;
export const ATTESTERADD_ADDRESS = process.env.ATTESTERADD_ADDRESS;
export const ETH_PROVIDER_URL = process.env.ETH_PROVIDER_URL;
export const PRIVATE_KEY = process.env.PRIVATE_KEY;

export const DB_PATH = process.env.DB_PATH ?? ":memory:";

export const provider = ETH_PROVIDER_URL.startsWith("http")
  ? new ethers.providers.JsonRpcProvider(ETH_PROVIDER_URL)
  : new ethers.providers.WebSocketProvider(ETH_PROVIDER_URL);
