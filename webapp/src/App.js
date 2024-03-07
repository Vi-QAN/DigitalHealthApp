import React, { Suspense } from "react";

import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import { Web3Modal } from "./hooks/useWalletConnect";
import { IPFSProvider } from "./hooks/useIPFS";

const Dicom = React.lazy(() => import("./pages/DICOM.jsx"))
const Login = React.lazy(() => import("./pages/Login.jsx"));
const Home = React.lazy(() => import("./pages/Home.jsx"));
// const Test = React.lazy(() => import("./pages/Test.jsx"));



function App() {

  return (
    <Router>
      <Web3Modal>
        <AuthProvider>
          <IPFSProvider>
            <Suspense fallback={<div>Loading...</div>}>
                <Routes>
                  <Route exact path={"/"} element={
                    <Home />} 
                  />

                  <Route path={"/dicom"} element={
                    <Dicom />} 
                  />

                  <Route exact path={"/login"} element={
                    <Login />
                  } />
                </Routes>
              
            </Suspense>
        
          </IPFSProvider>
        </AuthProvider>
      </Web3Modal>
    </Router>

  );
}

export default App;