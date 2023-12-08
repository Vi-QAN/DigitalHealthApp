import React, { useEffect } from "react";
import Web3 from 'web3';
import truffleContract from "@truffle/contract";
import digitalHealthABI from "../contracts/DigitalHealth.json";
import { useState } from "react";

const web3Context = React.createContext();

const getLocalProvider = () => {
  console.log('No web3 instance injected, using Local web3.');
  return new Web3('http://127.0.0.1:7545');
}

const getProvider = async () => {
  try {
    // Wait for loading completion to avoid race conditions with web3 injection timing.
    if (window.ethereum) {
      let provider = new Web3(window.ethereum);
      // Request account access if needed
      // window.ethereum.enable() is deprecated
      // use ethereum.request api instead
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      return provider;
    }
    // Legacy dapp browsers...
    if (window.web3) {
      // Use Mist/MetaMask's provider.
      return  window.web3;
    }
  } catch (e) {
    console.log(e);
    // Fallback to localhost; use dev console port by default...
    return getLocalProvider();
  }
}

const _web3Instance = await getProvider();

export default function useWeb3Context() {
    const digitalHealthContract = truffleContract(digitalHealthABI);

    const setProvider =  (instance) => {
        // If _web3Instance is undefined, fallback to local network
        if (!(_web3Instance)) {
            instance.setProvider(getLocalProvider().currentProvider);
            
        } else {
            instance.setProvider(_web3Instance.currentProvider);
        }
        // Default ganache network id is 5777.
        // Replace it with your working network id
        instance.setNetwork(parseInt(process.env.NETWORK_ID));
    }

    useEffect(() => {
      setProvider(digitalHealthContract);
    })
    
    return [
        digitalHealthContract,
        getLocalProvider,
    ]
}

export function Web3Provider({ children }) {
    const web3 = useWeb3Context();
  
    return <web3Context.Provider value={web3}>{children}</web3Context.Provider>;
  }

export function Web3Consumer() {
    return React.useContext(web3Context);
  }