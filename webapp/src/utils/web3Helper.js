
import { convertToBytes32 } from "./general";
import DigitalHealthContract from '../contracts/DigitalHealth.json';
import { readContract, writeContract } from "@wagmi/core";
import { http, createConfig } from 'wagmi'
import { mainnet, arbitrum, localhost } from 'wagmi/chains'
import { walletConnect } from 'wagmi/connectors'
import { createClient } from 'viem'


const abi = DigitalHealthContract['abi']
const contractAddress = '0x0dd1a267A7ceAb740E436Fb6978dDBB5b9205584'

// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://7212-2a02-8084-2162-e200-353b-3c48-d3c8-181c.ngrok-free.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const config = createConfig({
    chains: [arbitrum, mainnet, localhost],
    connectors: [
      walletConnect({ projectId, metadata, showQrModal: false }),
    ],
    client({ chain }) {
        return createClient({ chain, transport: http() })
      },
  })


export const login = async ({password, account}) => {
  const convertedPassword = convertToBytes32(password);
  return await readContract(config, {
      abi, 
      address: contractAddress,
      functionName: 'login',
      args: [convertedPassword],
      account: account,
      chainId: 1337,
  })
}

export const register = async ({name, email, password, account}) => {
  const convertedPassword = convertToBytes32(password);
  const convertedEmail = convertToBytes32(email);
  const convertedName = convertToBytes32(name);
  return await writeContract(config, {
    abi,
    address: contractAddress,
    functionName: 'signup',
    args: [convertedName, convertedEmail, convertedPassword], 
    account: account,
  })
}

export const authorizeAccessor = async () => {

}