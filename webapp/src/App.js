import React, { Suspense, useState} from "react";

import './App.css';
import fetch from "node-fetch";
import { BrowserRouter as Router, Route, Routes} from "react-router-dom";




const Home = React.lazy(() => import("./pages/Home.jsx"));
const Test = React.lazy(() => import("./pages/Test.jsx"));
const File1 = React.lazy(() => import("./pages/File1.jsx"));



function App() {

  return (
    <Suspense >
      <Router>
        <Routes>
          {/* <Route exact path={"/"} element={
            <Home />} 
          />

          <Route exact path={"/test"} element={
            <Test />} 
          /> */}
          <Route exact path={"/"} element={
            <File1 />} 
          />



          {/* <Route path="dashboard" component={UserIsAuthenticated(Dashboard)}  /> */}
       
          {/* <Route path="profile" component={UserIsAuthenticated(Profile)} /> */}
        </Routes>
      </Router>
    </Suspense>
  );
}

export default App;