import React, { useState, useContext, useEffect } from 'react';
import { Form, Button, Container, Row, Col, Dropdown } from 'react-bootstrap';
import { authContext } from '../hooks/useAuth';
import { useNavigate } from "react-router-dom";
import useWeb3Context from '../hooks/useWeb3Context';


const Login = () => {
  const [signupForm, setSignupForm] = useState({ name: '', email: '', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const { register, login, logout  } = useContext(authContext);
  const [ DigitalHealthContract, getLocalProvider ] = useWeb3Context();
  const [ accountList, setAccountList ] = useState(null);
  const navigate = useNavigate();

  const getCredential = async () => {
    const result = await getLocalProvider().eth.getAccounts();
    setAccountList(result);
  };  

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

  const handleSelect = (account) => {
    setSignupForm((prevForm) => ({ ...prevForm, ['account']: account}));
    setLoginForm((prevForm) => ({ ...prevForm, ['account']: account }));

    // You can perform additional actions here when an option is selected
    console.log(`Selected option: ${account}`);
  };

  useEffect(() => {  
    getCredential();
  },[])

  return (
    <Container className="mt-5">
      {accountList ? (
        <Dropdown onSelect={handleSelect}>
          <Dropdown.Toggle variant="success" id="dropdown-basic">
            Select an Option
          </Dropdown.Toggle>

          <Dropdown.Menu>
            {accountList.map(account => {
              
              return <Dropdown.Item key={account} eventKey={account}>{account}</Dropdown.Item>
            })}
            
          </Dropdown.Menu>
        </Dropdown>
        ) : (
          <p>Loading...</p>)}
      
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
    </Container>
  );
};

export default Login;
