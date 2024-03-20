
import { convertToBytes32 } from "./general";
import DigitalHealthContract from '../contracts/DigitalHealth.json';
// import { readContract, writeContract } from "@wagmi/core";
// import { http, createConfig } from 'wagmi'
// import { localhost } from '@wagmi/core/chains'
// import { injected} from 'wagmi/connectors'

import { createWalletClient, custom, http, createPublicClient } from 'viem'
import { localhost } from 'viem/chains'



const abi = DigitalHealthContract['abi']
const contractAddress = `${process.env.REACT_APP_CONTRACT_ADDRESS}`
const chainId = 1337


// 1. Get projectId at https://cloud.walletconnect.com
const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f'

// 2. Create wagmiConfig
const metadata = {
  name: 'Web3Modal',
  description: 'Web3Modal Example',
  url: 'https://77f3-2a02-8084-2162-e200-9022-9327-7d33-f9b9.ngrok-free.app', // origin must match your domain & subdomain
  icons: ['https://avatars.githubusercontent.com/u/37784886']
}

const customLocalhost = { 
  ...localhost, 
  rpcUrls: {
    public: {
      http: [`${process.env.REACT_APP_PUBLIC_CHAIN_URL}`]
    },
    default: {
      http: [`${process.env.REACT_APP_PUBLIC_CHAIN_URL}`]
    }
  }
}

const publicClient = createPublicClient({
  chain: customLocalhost,
  transport: http(),
})
 
const walletClient = createWalletClient({
  chain: customLocalhost,
  transport: custom(window.ethereum)
})
 

// const chains = [localhost]
// const config = createConfig({
//   chains,
//   connectors: [
//     injected({ target: 'metaMask' }) ,
//   ],
//   transports: {
//     [localhost.id]: http(),
//   },

// })


export const login = async ({email, password, account}) => {
  const convertedPassword = convertToBytes32(password);
  const convertedEmail = convertToBytes32(email);
  // return await readContract(config, {
  //     abi, 
  //     address: contractAddress,
  //     functionName: 'login',
  //     args: [convertedPassword],
  //     account: account,
  //     chainId: chainId,
  // })
  await publicClient.readContract({
    address: contractAddress,
    abi: abi,
    functionName: 'login',
    args: [convertedEmail, convertedPassword],
    account: account,
    chainId: chainId,
  })
}

export const register = async ({name, email, password, account}) => {
  const convertedPassword = convertToBytes32(password);
  const convertedEmail = convertToBytes32(email);
  const convertedName = convertToBytes32(name);
  // return await writeContract(config, {
  //   abi,
  //   address: contractAddress,
  //   functionName: 'signup',
  //   args: [convertedName, convertedEmail, convertedPassword], 
  //   account: account,
  //   chainId: chainId,
  // })
  const { request } = await publicClient.simulateContract({
    address: contractAddress,
    abi,
    functionName: 'signup',
    args: [convertedName, convertedEmail, convertedPassword],
    account,
    chainId: chainId,
  })
  return await walletClient.writeContract(request)
}

export const authorizeAccessor = ({accessor, password, owner}) => {
  const convertedPassword = convertToBytes32(password);
  return  {
    abi,
    address: contractAddress,
    functionName: 'addAccessor',
    args: [accessor, convertedPassword], 
    account: owner,
  }
}

export const revokeAccessor = ({accessor, password, owner}) => {
  const convertedPassword = convertToBytes32(password);
  return  {
    abi,
    address: contractAddress,
    functionName: 'removeAccessor',
    args: [accessor, convertedPassword], 
    account: owner,
    chainId: chainId,
  }
}