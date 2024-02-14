import React, { useState, useEffect } from 'react';
import { Form, Button, Container} from 'react-bootstrap';
import { AuthConsumer } from '../hooks/useAuth';
import { useWeb3Modal } from '@web3modal/wagmi/react'

import { FaConnectdevelop } from "react-icons/fa6";
import { VscDebugDisconnect } from "react-icons/vsc";

import { useAccount } from 'wagmi';




const Login = () => {
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [ isLoginState, setIsLoginState ] = useState(1);
  const { register, login } = AuthConsumer();
  const account  = useAccount();
  
  const { open } = useWeb3Modal()

  const handleSignupChange = (e) => {
    const { name, value } = e.target;
    setSignupForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm((prevForm) => ({ ...prevForm, [name]: value }));
  };

  const handleSignupSubmit = (e) => {
    e.preventDefault();
    console.log('Sign up form submitted:', signupForm);
    register(signupForm);

    // Add logic to send sign-up data to the server
  };

  const handleSwitchForm = () => {

  }

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', loginForm);
    login(loginForm);
    // Add logic to send login data to the server
  };

  useEffect(() => {  
  },[])

  return (
    <Container fluid>
      <Container fluid style={{backgroundColor: '#070f25'}} className="d-flex ps-0 flex-row rounded">
        <Container fluid className="col-3 p-0 rounded">
          <img style={{width: '100%', height: '100%'}} src="https://images.pexels.com/photos/6732059/pexels-photo-6732059.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" className='rounded' alt="navy file sharing" />
        </Container>
        <Container className="p-5 col-3 " >
          <Button style={{width: '50%', backgroundColor: '#2c3144'}} className="mb-5" onClick={() => setIsLoginState(state => !state)}>
            {isLoginState ? 'Sign Up' : 'Login' }
          </Button>
          <h1 style={{color: 'white',fontSize: '50px'}}>Be apart of our team</h1>        
        </Container>
        {!isLoginState && <Container style={{color: 'white'}} className="d-flex flex-column col-6 rounded py-5 align-items-center justify-content-center">
          <h2>Sign Up</h2>
          <Form style={{width: '80%'}}onSubmit={handleSignupSubmit}>
            <Form.Group className="mt-5">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  required
                  style={{color: 'white', padding: '15px', backgroundColor: '#2c3144', border: 'none'}}
                />
              </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
                style={{color: 'white', padding: '15px', backgroundColor: '#2c3144', border: 'none'}}

              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                required
                style={{color: 'white', padding: '15px', backgroundColor: '#2c3144', border: 'none'}}
              />
            </Form.Group>
            <Form.Group className='d-flex flex-row justify-content-between align-items-center mt-5 p-0'>
              <Form.Control 
                value={account.address ? account.address : 'Connect your wallet'} type='text' style={{padding: '15px', color: 'white', backgroundColor: '#2c3144', border: 'none', maxWidth: '80%'}} readOnly/>
              <Button onClick={() => open()} >
                {account.address ? <FaConnectdevelop size={24}/> : <VscDebugDisconnect  size={24}/>}
                
              </Button>
            </Form.Group>
            <Button style={{marginTop: '3em', width: '30%', backgroundColor: '#2c3144'}} type="submit">
              Sign Up
            </Button>
          </Form>
        </Container>}

        {isLoginState && <Container style={{color: 'white'}}  className="d-flex flex-column col-6 rounded py-5 align-items-center justify-content-center">
          <h2> Login</h2>
          <Form style={{width: '80%'}} onSubmit={handleLoginSubmit}>
            <Form.Group className="mt-5">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
                style={{color: 'white', padding: '15px', backgroundColor: '#2c3144', border: 'none'}}
              />
            </Form.Group>
            <Form.Group className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
                style={{color: 'white', padding: '15px', backgroundColor: '#2c3144', border: 'none'}}
              />
            </Form.Group>

            <Form.Group className='d-flex flex-row justify-content-between align-items-center mt-5 p-0'>
              <Form.Control 
                value={account.address ? account.address : 'Connect your wallet'} type='text' style={{padding: '15px', color: 'white', backgroundColor: '#2c3144', border: 'none', maxWidth: '80%'}} readOnly/>
              <Button onClick={() => open()} >
                {account.address ? <FaConnectdevelop size={24}/> : <VscDebugDisconnect  size={24}/>}
                
              </Button>
            </Form.Group>
            
            <Button style={{marginTop: '3em', width: '30%', backgroundColor: '#2c3144'}} type="submit">
              Login
            </Button>
          </Form>
        </Container>}
      </Container>

    </Container>
  );
};

export default Login;
