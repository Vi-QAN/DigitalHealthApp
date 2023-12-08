// import * as React from "react";
// import {_web3Instance, _getLocalProvider} from "../lib/Web3Context";
// import {AuthenticationContract} from "../lib/AuthenticationContext";

// const authContext = React.createContext();

// function useAuth() {
//   const [authed, setAuthed] = React.useState(false);

//   return {
//     authed,
//     login() {

//         return new Promise((res) => {
//             _web3Instance.eth.getCoinbase((error, coinbase) => {
//                 // Log errors, if any.
//                 if (error) {
//                 console.error(error);
//                 }
        
//                 AuthenticationContract.deployed().then(function(instance) {
        
//                 // Attempt to sign up user.
//                 instance.methods.signup(name, {from: coinbase})
//                 .then(function(result) {
//                     // If no error, login user.
//                     return dispatch(loginUser())
//                 })
//                 .catch(function(result) {
//                     // If error...
//                 })
//                 })
//             })
//             setAuthed(true);
//             res();
//         });
//     },
//     logout() {
//       return new Promise((res) => {
//         setAuthed(false);
//         res();
//       });
//     },
//   };
// }

// export function AuthProvider({ children }) {
//   const auth = useAuth();

//   return <authContext.Provider value={auth}>{children}</authContext.Provider>;
// }

// export default function AuthConsumer() {
//   return React.useContext(authContext);
// }