import * as React from "react";
import useWeb3Context from "./useWeb3Context";
import { useNavigate} from 'react-router-dom';
import { convertToBytes32 } from "../utils";


const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [ user, setUser ] = React.useState({userId: 0, key: '', account: ''});
  const [ contract, setContract ] = React.useState(null);
  const [ DigitalHealthContract ] = useWeb3Context();
  const navigate = useNavigate();
  
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
  }, [auth.authed]);

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function AuthConsumer() {
  return React.useContext(authContext);
}

export { authContext, AuthProvider, AuthConsumer }