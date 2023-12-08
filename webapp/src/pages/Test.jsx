import React, { useEffect, useState, forwardRef, useRef } from "react";
import {Button, Container, Collapse, ListGroup, Alert } from 'react-bootstrap';
import { Lock, Unlock } from 'react-bootstrap-icons';

import useWeb3Context from "../hooks/useWeb3Context";

import { create } from 'ipfs-http-client'

import NavComponent from "../components/Navbar"
import { SaveFile, FileList} from "./File";

const name  = "0x244680604e2c03ee50773fbab366676f6b2f574e7706890de783607d02bb5ff5";



const Test = () => {
  const [ ipfs, setIpfs ] = useState(null);
  const [ input, setInput ] = useState(null);
  const [ contract, setContract] = useState(null);
  const [ DigitalHealthContract, getLocalProvider ] = useWeb3Context();
  const [ authorizationList, setAuthorizationList ] = useState([]);
  const [ authorizedFileList, setAuthorizedFileList] = useState([]);
  const [ accounts, setAccounts] = useState([]);
  const [ userId, setUserId] = useState(null);
  const [ openItems, setOpenItems ] = useState([]);
  const ref = useRef(null);

  
  const setupBlockChain = () =>{
    DigitalHealthContract
      .deployed()
      .then(async function(instance) {
        setContract(instance);
        const result = await getLocalProvider().eth.getAccounts()
        setAccounts(result);

        await instance.signup(name, {from: result[1]})
        try {

          const response = await fetch('http://localhost:5273/api/User', {
              method: "POST",
              headers: {
                "Content-type": "application/json"
              },
              body: JSON.stringify({
                "userName": "Hospital 1",
                "contractAddress": result[1]
              })
            }).then(res => res.json())

          const id = await response;
          setUserId(id);
        } catch (error) {
          // Failed to load web3, accounts, or contract. Check console for details.
          console.error(error);
        }
       }).catch(e => {
          // Failed to load web3, accounts, or contract. Check console for details.
          console.error(e);
        });
  }

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


  const getAuthorizedFileList = async () => {
    try {
      const res = await fetch('http://localhost:5273/api/information/accessor/' + userId, {
      method: "GET",
      headers: {
        "Content-type": "application/json"
      },
      }).then(response => response.json())
      const list = await res;
      setAuthorizedFileList(list);
      const openItems = list.map((item) => { return { ...item, isOpened: false }});
      setOpenItems(openItems);
      console.log(openItems);
    } catch (err){
      console.log("Cannot get file list" + err);
    }
    
  }

  useEffect(() => {
    setupBlockChain();
    setupIPFS();
  },[]);

  useEffect(() => {
    if (!userId) return;
    getAuthorizedFileList();
  }, [userId])


  const handleToggle = (e, index) => {
    e.preventDefault();
    const updatedOpenItems = [...openItems];
    updatedOpenItems[index].isOpened = !updatedOpenItems[index].isOpened;
    setOpenItems(updatedOpenItems);
  };

  
  
  return (
    <>
      <NavComponent />
      
      { openItems.length > 0 ? 
        <Container>
            <ListGroup>
              {openItems.map((item, index) => (
                  <ListGroup.Item key={index}>
                    <Container>
                      <Button
                        onClick={(e) => handleToggle(e, index)}
                        aria-controls="collapse-info"
                        aria-expanded={openItems[index].isOpened}
                        className="mb-3 mr-3"
                        disabled={!item.isAuthorized}
                      >
                        {item.userName}
                      </Button>
                      {!item.isAuthorized ? <Lock color="royalblue" size={20} className="align-right"/> : <Unlock color="royalblue" size={20} className="align-right" />}
                       
                    </Container>
                    
                    <Collapse in={openItems[index].isOpened}>
                      <Container id="collapse-info">
                        {item.informationList.map((item) => (
                          <Container className="mb-2">
                            <a href={'http://127.0.0.1:8080/ipfs/' + item.fileHash}> 
                            {
                              item.fileName + '.' + item.fileExtension
                            
                            } </a>
                          </Container>
                        ))}
                        
                      </Container>
                    </Collapse>
                      
                  </ListGroup.Item>
              ))}
            </ListGroup>
        </Container>
            
            
        
        
        :
        <Container>
          <Alert variant='light'>You have not added any file</Alert> 
        </Container>
        
      }
      
      {/* { ipfs && userId &&
        <SaveFile ipfs={ipfs} userId={userId} setFileList={setFileList}/> 
      } */}
    </>
     
  );
}

export default Test;