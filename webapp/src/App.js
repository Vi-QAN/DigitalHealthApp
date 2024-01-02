import React, { Suspense } from "react";

import './App.css';
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";

import { AuthProvider } from "./hooks/useAuth";
import { Web3Provider } from "./hooks/useWeb3Context";

const Login = React.lazy(() => import("./pages/Login.jsx"));
const Home = React.lazy(() => import("./pages/Home.jsx"));
// const Test = React.lazy(() => import("./pages/Test.jsx"));
const File1 = React.lazy(() => import("./pages/File1.jsx"));



function App() {

  return (
    <Router>
      <Web3Provider>
        <AuthProvider>
          <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route exact path={"/"} element={
                  <Home />} 
                />

                {/* <Route exact path={"/test"} element={
                  <Test />} 
                /> */}

                <Route exact path={"/login"} element={
                  <Login />
                } />
                <Route path={"/file"} element={
                  <File1 />} 
                />



                {/* <Route path="dashboard" component={UserIsAuthenticated(Dashboard)}  /> */}
            
                {/* <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
              </Routes>
            
          </Suspense>
        </AuthProvider>
      </Web3Provider>
    </Router>

  );
}

export default App;