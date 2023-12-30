import * as React from "react";
import useWeb3Context from "./useWeb3Context";

const authContext = React.createContext();

function useAuth() {
  const [authed, setAuthed] = React.useState(false);
  const [ userId, setUserId ] = React.useState(null);
  const [ contract, setContract ] = React.useState(null);
  const [ DigitalHealthContract ] = useWeb3Context();

  const convertToBytes32 = (value) => {
    if (value.length > 32) {
        throw new Error('Input string exceeds 32 characters');
    }
    
    // Convert the string to UTF-8 bytes
    const utf8Bytes = new TextEncoder().encode(value);

    // Create a Uint8Array with 32 bytes (bytes32)
    const bytes32 = new Uint8Array(32);

    // Copy the UTF-8 bytes to the bytes32 array
    bytes32.set(utf8Bytes);

    return '0x' + Buffer.from(bytes32).toString('hex');
  }

  return {
    contract,
    authed,
    userId,
    register(form) {
        return new Promise((res) => {
            DigitalHealthContract
            .deployed()
            .then(async function(instance) {
                await instance.signup(convertToBytes32(form.name), convertToBytes32(form.email),convertToBytes32(form.password), {from: form.account})
            //     try {
            //     const response = await fetch('http://localhost:5273/api/User', {
            //         method: "POST",
            //         headers: {
            //         "Content-type": "application/json"
            //         },
            //         body: JSON.stringify({
            //         "userName": "User 1",
            //         "contractAddress": result[0]
            //         })
            //     }).then((res) => res.json());
            // } catch (error) {
            // // Failed to connect to server.
            // console.error(error);
            // }
            }).catch(e => {
                // Failed to load web3, accounts, or contract.
                console.error(e);
            });
            setAuthed(true);
            res();
        });
    },
    login(form) {
        return new Promise((res) => {
            DigitalHealthContract
            .deployed()
            .then(async function(instance) {
                const email = await instance.login(convertToBytes32(form.password), {from: form.account});
                console.log(email);
                setContract(instance);
            //     try {
            //     const response = await fetch('http://localhost:5273/api/User/' + result[0], {
            //         method: "GET",
            //         headers: {
            //         "Content-type": "application/json"
            //         },
            //     }).then((res) => res.json()).then(result => result);
            
                
            //     setUserId(response.userId);
            // } catch (error) {
            //     // Failed to connect to server.
            //     console.error(error);
            // }
            }).catch(e => {
                // Failed to load web3, accounts, or contract.
                console.error(e);
            });
            setAuthed(true);
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

  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

function AuthConsumer() {
  return React.useContext(authContext);
}

export { authContext, AuthProvider, AuthConsumer }