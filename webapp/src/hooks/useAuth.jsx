import * as React from "react";
import { useNavigate} from 'react-router-dom';
import { login, register } from '../utils/web3Helper'
import { registerRequest, loginRequest } from "../utils/fileHandler";
import { useAccount } from "wagmi";
import { useEffect } from "react";

const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [ user, setUser ] = React.useState({userId: 0, key: ''});
  const navigate = useNavigate();
  const account = useAccount();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('user'))
    if (storedUser) {
      setUser(storedUser);
      setAuthed(true);
    }
  },[])
  
  return {
    authed,
    user,
    register(form) {
      try {
        register({name: form.name, email: form.email, password: form.password, account: account.address})
        registerRequest({name: form.name, account: account.address})
        navigate('/DigitalHealthApp/login');
      } catch (err) {
        console.error(err);
      }
    },
    async login(form) {
      try {
        const blockchainResult = await login({email: form.email, password: form.password, account: account.address})
        if (blockchainResult == 0x0) return;
        const serverResult = await loginRequest({account: account.address});
        if (serverResult == undefined) return;
        setAuthed(true);
        setUser(serverResult);
        localStorage.setItem('user', JSON.stringify(serverResult));
        navigate('/DigitalHealthApp/');
      } catch (err){
        console.error(err);
      }
      
         
    },
    logout() {
      setAuthed(false);
      localStorage.removeItem('user');
      navigate('/DigitalHealthApp/login');
      
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