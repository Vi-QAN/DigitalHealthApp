import React, { useEffect, useState, useContext } from "react";
import { useNavigate} from 'react-router-dom';
import {Button, Container, Form, ListGroup, Alert } from 'react-bootstrap';

import { authContext } from "../hooks/useAuth";

import { create } from 'ipfs-http-client'

import NavComponent from "../components/Navbar"
import PasswordConfirmationModal from "../components/PasswordConfirmModal";
import {  OwnedFileList, AuthorizedFileList } from "../components/File";

import { convertToBytes32 } from "../utils/general";

const AuthorizationList = ({user, contract, authorizationList, setAuthorizationList}) => {
  const handleRevoke = async (accessor) => {
    if (user.userId == null) return;

    await contract.removeAccesser(accessor, convertToBytes32("password"), {from: user.account})
    // const accesser = await contract.getAccesser(accounts[0], accessorid, {from: accounts[0]})
    const result = await fetch('http://localhost:5273/api/user/authorization', {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "OwnerId": user.account,
        "AccesserId": accessor,
      })
    }).then(response => response.json())
    setAuthorizationList(authorizationList.map(item => {
      const newItem = (item.accessorId === accessor) ? { ...item, isAuthorized: false} : item
        
      return newItem;   
    }))
  }
  

  return (
    <Container className="mb-3"> 
      <Form.Label>Authorization List</Form.Label>
      <ListGroup>
        {authorizationList.map((item) => (
          <ListGroup.Item key={item.accessorId} className="d-flex justify-content-between text">
            {item.name}
            <Button onClick={() => handleRevoke(item.accessorId)} disabled={!item.isAuthorized}>Revoke</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}


const Home = () => {
  const [ ipfs, setIpfs ] = useState(null);
  const [ input, setInput ] = useState(null);
  const [ authorizationList, setAuthorizationList ] = useState([]);
  const [ confirmedPassword, setConfirmedPassword] = useState('');
  const { contract, authed, user } = useContext(authContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  
  const handleAuthorize = async (e) => {
    if (user.userId == null || input == null) return;
    if (input == user.account) return  
    await contract.addAccessor(input, convertToBytes32(confirmedPassword), {from: user.account});
    // const accesser = await contract.getAccesser(accounts[0], input, {from: accounts[0]})
    const result = await fetch('http://localhost:5273/api/user/authorization', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "OwnerId": user.account,
        "AccesserId": input,
      })
    }).then(response => response.json())  
    console.log('here')
    setAuthorizationList(authorizationList.map(item => {
      const newItem = (item.accessorId === input) ? { ...item, isAuthorized: true} : item
        
      return newItem;   
    }))  
  }

  const handleOpenModal = (e) => {
    e.preventDefault();
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmPassword = (password) => {
    setConfirmedPassword(password);
    // Handle password confirmation logic here
    handleAuthorize();
  };

  const setupIPFS = async () => {
    try {
      const http = create('/ip4/127.0.0.1/tcp/5001')
      const isOnline = await http.isOnline()
  
      if (isOnline) {
        setIpfs(http);
      }
    }
    catch(err) {
      console.log(err.message)
    }
  }

  const getAuthorizationList = async () => {
    try {
      const res = await fetch('http://localhost:5273/api/user/' + user.userId +'/authorization/', {
        method: "GET",
        headers: {
          "Content-type": "application/json"
        },
      }).then(response => response.json())

      const list = await res;
      setAuthorizationList(list);
    } catch (err){
      console.log("Cannot get authorization list" + err)
    }
    
  }



  useEffect(() => {
    if (!authed){
      navigate('/login');
    }
    //setupBlockChain();
    if (!user.userId) return;
      getAuthorizationList();
      //setupIPFS();
  },[]);

  
  
  return (
    <>
      <NavComponent user={user} />
      <Container className="mb-3">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Authorization</Form.Label>
            <Form.Control type="text" placeholder="id" onChange={(e) => setInput(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={(e) => handleOpenModal(e)}>
            Authorize
          </Button>
        </Form>
      </Container>
      
      { authorizationList.length > 0 ? 
        <AuthorizationList user={user} contract={contract} authorizationList={authorizationList} setAuthorizationList={setAuthorizationList}/>
        :
        <Container>
          <Alert variant='light'>You have not authorized anyone</Alert> 
        </Container>
        
      }

      { user && <OwnedFileList ipfs={ipfs} owner={{ userId: user.userId, key: user.key}}/> }

      { user && <AuthorizedFileList ipfs={ipfs} accessor={{ userId: user.userId, key: user.key}}/>}
      
      <PasswordConfirmationModal
        show={isModalOpen}
        onHide={handleCloseModal}
        onConfirm={handleConfirmPassword}
      />
      
    </>
      
     
  );
}

export default Home;