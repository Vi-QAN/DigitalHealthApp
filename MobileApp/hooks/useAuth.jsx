import * as React from "react";
import { login, register } from '../utils/web3Helper'
import { registerRequest, loginRequest } from "../utils/fileHandler";
import { useAccount, useContractWrite } from "wagmi";
import { useEffect } from "react";
import AsyncStorage  from "@react-native-async-storage/async-storage";

import DigitalHealthContract from '../contracts/DigitalHealth.json';
const abi = DigitalHealthContract['abi']

const contractAddress = `${process.env.EXPO_PUBLIC_CONTRACT_ADDRESS}`
const chainId = 1337

const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [ user, setUser ] = React.useState({userId: 0, key: '', name: ''});
  const account = useAccount();
  const { data, writeAsync, error, isError } = useContractWrite({
    abi,
    address: contractAddress,
    functionName: 'signup',
    account: account,
    chainId: chainId,});
  

  const load = async () => {
    const storedUser = JSON.parse(await AsyncStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser);
      setAuthed(true);
    }
  }

  useEffect(() => {
    load();
  },[])
  
  return {
    authed,
    user,
    async register({name, email, password, navigation}) {
      try {
        const registerObject = register({name: name, email: email, password: password, account: account.address})
        //console.log(registerObject);
        await writeAsync(registerObject);
        registerRequest({name: name, account: account.address})
        navigation.navigate('Login');
      } catch (err) {
        console.error(err);
      }
    },
    async login({email, password, navigation}) {
      try {
        const blockchainResult = await login({email: email, password: password, account: account.address})
        if (blockchainResult == 0x0) return;
        const serverResult = await loginRequest({account: account.address});
        if (serverResult == undefined) return;
        setAuthed(true);
        setUser(serverResult);
        await AsyncStorage.setItem('user', JSON.stringify(serverResult));
      } catch (err){
        console.log(err);
      }
      
         
    },
    logout() {
      setAuthed(false);
      AsyncStorage.removeItem('user');
      //navigate('/login');
      
    },
  };
}

function AuthProvider({ children }) {
  const auth = useAuth();
  
  React.useEffect(() => {
    console.log('Auth state changed:', auth.authed);
    return () => {
      console.log('AuthProvider unmounted');
    };
  }, []);

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function AuthConsumer() {
  return React.useContext(authContext);
}

export { AuthProvider, AuthConsumer }