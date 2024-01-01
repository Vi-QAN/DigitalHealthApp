import * as React from "react";
import useWeb3Context from "./useWeb3Context";
import { useNavigate} from 'react-router-dom';
import { convertToBytes32 } from "../utils/general";


const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [ user, setUser ] = React.useState({userId: 0, key: '', account: ''});
  const [ contract, setContract ] = React.useState(null);
  const [ DigitalHealthContract ] = useWeb3Context();
  const navigate = useNavigate();

  const test = () => {
    DigitalHealthContract
            .deployed()
            .then(async function(instance) {
              //await instance.setKey('0x5D1F72353c9375440533d5d08F0756D6F0234A44', '0xfa3f56dc5ae8fd763f29cb9cf128476b1e1a2465e98e3d1058ee166fb4074b0b','0x9fdcfa503910ae3e5f508e0cd0e9b353', {from: '0xe543BCF6818Dd7a5AE26a1722150F70f543b31F2'})
              const result = await instance.getKey('0x5D1F72353c9375440533d5d08F0756D6F0234A44','0xFB92D4c2783A948C9f745592e5634448F15F3b01', {from: '0xc195cf823EC6245c71182f88F1faBAC87d09EaB1'})
              console.log(result);
            }).catch(e => {
                // Failed to load web3, accounts, or contract.
                console.error(e);
            });
  }

  React.useEffect(() => {
    test();
  },[])
  
  return {
    contract,
    authed,
    user,
    register(form) {
        return new Promise((res) => {
            DigitalHealthContract
            .deployed()
            .then(async function(instance) {
              await instance.signup(convertToBytes32(form.name), convertToBytes32(form.email),convertToBytes32(form.password), {from: form.account})
              try {
                const response = await fetch('http://localhost:5273/api/User/signup', {
                    method: "POST",
                    headers: {
                    "Content-type": "application/json"
                    },
                    body: JSON.stringify({
                    "userName": form.name,
                    "key": form.account
                    })
                }).then((res) => res.json());
              } catch (error) {
                // Failed to connect to server.
                console.error(error);
              }
            }).catch(e => {
                // Failed to load web3, accounts, or contract.
                console.error(e);
            });
            res();
        });
    },
    login(form) {
        return new Promise((res) => {
            DigitalHealthContract
            .deployed()
            .then(async function(instance) {
              try {
                const name = await instance.login(convertToBytes32(form.password), {from: form.account});
                console.log(name);
                setContract(instance);

                try {
                  const response = await fetch('http://localhost:5273/api/User/' + form.account, {
                      method: "GET",
                      headers: {
                        "Content-type": "application/json"
                      },
                  }).then((res) => res.json()).then(result => result);
                  console.log(response);
                  
                  setUser({userId: response.userId, key: response.key, account: form.account});
                  setAuthed(true);
                  navigate('/');
                } catch (error) {
                    // Failed to connect to server.
                    console.error(error);
                }

              } catch(e) {
                console.error(e);
              }
                 
            }).catch(e => {
                // Failed to load web3, accounts, or contract.
                console.error(e);
            });
            
            res();
        });
    },
    logout() {
        return new Promise((res) => {
          setAuthed(false);
          res();
      });
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

export { authContext, AuthProvider, AuthConsumer }