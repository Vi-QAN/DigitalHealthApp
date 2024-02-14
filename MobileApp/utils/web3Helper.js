
import { convertToBytes32 } from "./general";
import { readContract, writeContract } from "@wagmi/core";
import { createPublicClient, http, createWalletClient, custom } from 'viem'
import { localhost } from 'viem/chains'
import { defaultWagmiConfig  } from '@web3modal/wagmi-react-native'

import DigitalHealthContract from '../contracts/DigitalHealth.json';
const abi = DigitalHealthContract['abi']
const contractAddress = `${process.env.EXPO_PUBLIC_CONTRACT_ADDRESS}`
const chainId = 1337

const publicClient = createPublicClient({
    chain: localhost,
    transport: http(`${process.env.EXPO_PUBLIC_CHAIN_URL}`)
  })



const projectId = '0caac0cf0fc25f80bea5b3fdbd2af07f';

const metadata = {
  name: 'Web3Modal RN',
  description: 'Web3Modal RN Example',
  url: 'https://web3modal.com',
  icons: ['https://avatars.githubusercontent.com/u/37784886'],
  redirect: {
    native: 'YOUR_APP_SCHEME://',
    universal: 'YOUR_APP_UNIVERSAL_LINK.com'
  }
}

const chains = [localhost]

const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })


export const login = async ({password, account}) => {
  const convertedPassword = convertToBytes32(password);
  return await publicClient.readContract( {
      abi, 
      address: contractAddress,
      functionName: 'login',
      args: [convertedPassword],
      account: account
  })
}

export const register = ({name, email, password, account, walletClient}) => {
    console.log(publicClient, 'aa', walletClient)
  const convertedPassword = convertToBytes32(password);
  const convertedEmail = convertToBytes32(email);
  const convertedName = convertToBytes32(name);
  
  // const {request } = await publicClient.simulateContract( {
  //   abi,
  //   address: contractAddress,
  //   functionName: 'signup',
  //   args: [convertedName, convertedEmail, convertedPassword], 
  //   account: account,
  //   chainId: chainId,
  // })
  // return await walletClient?.writeContract(request);

  return {
    abi,
    address: contractAddress,
    functionName: 'signup',
    args: [convertedName, convertedEmail, convertedPassword], 
    account: account,
    chainId: chainId,
  }
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