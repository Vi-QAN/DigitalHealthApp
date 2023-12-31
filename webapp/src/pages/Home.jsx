import React, { useEffect, useState, useContext } from "react";
import { useNavigate} from 'react-router-dom';
import {Button, Container, Form, ListGroup, Alert } from 'react-bootstrap';

import { authContext } from "../hooks/useAuth";

import { create } from 'ipfs-http-client'

import NavComponent from "../components/Navbar"
import PasswordConfirmationModal from "../components/PasswordConfirmModal";
import { SaveFile, FileList} from "./File";

import { convertToBytes32 } from "../utils";

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
  const [ fileList, setFileList] = useState([]);
  const [ confirmedPassword, setConfirmedPassword] = useState('');
  const { contract, authed, user } = useContext(authContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const navigate = useNavigate();
  
  const handleAuthorize = async (e) => {
    if (user.userId == null || input == null) return;
    if (input == user.account) return  
    console.log(input, confirmedPassword, user.userId);
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
    console.log('Confirmed password:', password);
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
      console.log(list)
      setAuthorizationList(list);
    } catch (err){
      console.log("Cannot get authorization list" + err)
    }
    
  }

  const getFileList = async () => {
    try {
      const res = await fetch('http://localhost:5273/api/information/' + user.userId, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      },
      }).then(response => response.json())
      const list = await res;
      console.log(list)
      setFileList(list);
    } catch (err){
      console.log("Cannot get file list" + err);
    }
    
  }

  useEffect(() => {
    if (!authed){
      navigate('/login');
    }
    //setupBlockChain();
    if (!user.userId) return;
      getFileList();
      getAuthorizationList();
      setupIPFS();
  },[]);

  
  
  return (
    <>
      <NavComponent />
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

      { fileList.length > 0 ? 
        <FileList ipfs={ipfs} fileList={fileList}/>
        :
        <Container>
          <Alert variant='light'>You have not added any file</Alert> 
        </Container>
        
      }
      
      { ipfs && user.userId &&
        <SaveFile ipfs={ipfs} userId={user.userId} setFileList={setFileList}/> 
      }

      <Container>
      <button onClick={handleOpenModal}>Open Password Modal</button>
      <PasswordConfirmationModal
        show={isModalOpen}
        onHide={handleCloseModal}
        onConfirm={handleConfirmPassword}
      />
    </Container>
    </>
      
     
  );
}

export default Home;