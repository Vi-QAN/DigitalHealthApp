import React, { useEffect, useState, useContext } from "react";
import { useNavigate} from 'react-router-dom';
import {Button, Container, Form, ListGroup, Alert } from 'react-bootstrap';

import { authContext } from "../hooks/useAuth";

import { create } from 'ipfs-http-client'

import NavComponent from "../components/Navbar"
import { SaveFile, FileList} from "./File";

const name  = "0xb2840da3ac4e2057915102bc9dc97c336fbf2701c5444522e3490383f524db59";


const AuthorizationList = ({userId, accounts, contract, authorizationList, setAuthorizationList}) => {
  const handleRevoke = async (accessorid) => {
    if (userId == null) return;

    await contract.removeAccesser(accounts[0], accessorid, {from: accounts[0]})
    const accesser = await contract.getAccesser(accounts[0], accessorid, {from: accounts[0]})
    const result = await fetch('http://localhost:5273/api/user/authorization', {
      method: "PUT",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "OwnerId": userId,
        "AccesserId": accessorid,
      })
    }).then(response => response.json())
    setAuthorizationList(authorizationList.map(item => {
      const newItem = (item.accessorId === accessorid) ? { ...item, isAuthorized: false} : item
        
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
  const [ accounts, setAccounts] = useState([]);
  const { contract, authed, userId } = useContext(authContext);
  const navigate = useNavigate();
  
  const handleAuthorize = async (e) => {
    e.preventDefault();
    if (userId == null || input == null) return;
    if (input == userId) return    
    await contract.addAccesser(accounts[0],input, {from: accounts[0]});
    const accesser = await contract.getAccesser(accounts[0], input, {from: accounts[0]})
    const result = await fetch('http://localhost:5273/api/user/authorization', {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        "OwnerId": userId,
        "AccesserId": input,
      })
    }).then(response => response.json())  
    setAuthorizationList(authorizationList.map(item => {
      const newItem = (item.accessorId === input) ? { ...item, isAuthorized: true} : item
        
      return newItem;   
    }))  
  }

  // const setupBlockChain = () =>{
  //   DigitalHealthContract
  //     .deployed()
  //     .then(async function(instance) {
  //       setContract(instance);
  //       const result = await getLocalProvider().eth.getAccounts()
  //       setAccounts(result);
  //       await instance.signup(name, {from: result[0]})
  //       try {
  //         const response = await fetch('http://localhost:5273/api/User', {
  //           method: "POST",
  //           headers: {
  //             "Content-type": "application/json"
  //           },
  //           body: JSON.stringify({
  //             "userName": "User 1",
  //             "contractAddress": result[0]
  //           })
  //         }).then((res) => res.json());
    
  //         const id = await response;
  //         setUserId(id);
  //       } catch (error) {
  //         // Failed to connect to server.
  //         console.error(error);
  //       }
  //      }).catch(e => {
  //         // Failed to load web3, accounts, or contract.
  //         console.error(e);
  //       });
  // }

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
      const res = await fetch('http://localhost:5273/api/user/' + userId +'/authorization/', {
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
      const res = await fetch('http://localhost:5273/api/information/' + userId, {
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
    setupIPFS();
  },[]);

  useEffect(() => {
    if (!userId) return;
    getFileList();
    getAuthorizationList();
  }, [userId])

  useEffect(() => {

  },[authorizationList])

  
  return (
    <>
      <NavComponent />
      <Container className="mb-3">
        <Form>
          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Authorization</Form.Label>
            <Form.Control type="number" placeholder="id" onChange={(e) => setInput(e.target.value)}/>
          </Form.Group>
          <Button variant="primary" type="submit" onClick={(e) => handleAuthorize(e)}>
            Authorize
          </Button>
        </Form>
      </Container>
      
      { authorizationList.length > 0 ? 
        <AuthorizationList userId={userId} accounts={accounts} contract={contract} authorizationList={authorizationList} setAuthorizationList={setAuthorizationList}/>
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
      
      { ipfs && userId &&
        <SaveFile ipfs={ipfs} userId={userId} setFileList={setFileList}/> 
      }
    </>
      
     
  );
}

export default Home;