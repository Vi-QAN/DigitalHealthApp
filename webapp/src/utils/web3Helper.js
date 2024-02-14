
import { convertToBytes32 } from "./general";
import DigitalHealthContract from '../contracts/DigitalHealth.json';
import { readContract, writeContract, getAccount } from "@wagmi/core";
import { http, createConfig } from 'wagmi'
import { localhost } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'

const abi = DigitalHealthContract['abi']
const contractAddress = `${process.env.REACT_APP_CONTRACT_ADDRESS}`
const chainId = 1337



// // 1. Get projectId at https://cloud.walletconnect.com
// const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f'

// // 2. Create wagmiConfig
// const metadata = {
//   name: 'Web3Modal',
//   description: 'Web3Modal Example',
//   url: 'https://77f3-2a02-8084-2162-e200-9022-9327-7d33-f9b9.ngrok-free.app', // origin must match your domain & subdomain
//   icons: ['https://avatars.githubusercontent.com/u/37784886']
// }

const chains = [localhost]
const config = createConfig({
  chains,
  connectors: [
    injected(),
  ],
  transports: {
    [localhost.id]: http(),
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
      chainId: chainId,
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
    chainId: chainId,
  })
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