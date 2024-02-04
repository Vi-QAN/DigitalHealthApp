import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { AuthConsumer } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import { useWeb3Modal } from '@web3modal/wagmi/react'
import { useReadContract } from 'wagmi';

function ConnectButton() {
  // 4. Use modal hook
  const { open } = useWeb3Modal()

  return (
    <>
      <button onClick={() => open()}>Open Connect Modal</button>
      <button onClick={() => open({ view: 'Networks' })}>Open Network Modal</button>
    </>
  )
}


const Login = () => {
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { register, login } = AuthConsumer();
  const navigate = useNavigate();

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

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    console.log('Login form submitted:', loginForm);
    login(loginForm);
    // Add logic to send login data to the server
  };

  useEffect(() => {  
  },[])

  return (
    <Container className="mt-5">
      <Row>
        <Col md={6}>
          <h2>Sign Up</h2>
          <Form onSubmit={handleSignupSubmit}>
            <Form.Group className="mb-3">
                <Form.Label>Name</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={signupForm.name}
                  onChange={handleSignupChange}
                  required
                />
              </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={signupForm.email}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={signupForm.password}
                onChange={handleSignupChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Sign Up
            </Button>
          </Form>
        </Col>

        <Col md={6}>
          <h2>Login</h2>
          <Form onSubmit={handleLoginSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Login
            </Button>
          </Form>
        </Col>
      </Row>
      <ConnectButton />
    </Container>
  );
};

export default Login;
