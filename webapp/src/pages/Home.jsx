import React, { Fragment, useEffect, useState } from "react";
import { useNavigate} from 'react-router-dom';
import {Button, Container, ListGroup, Alert } from 'react-bootstrap';
import Select from "react-select";

import { AuthConsumer } from "../hooks/useAuth";


import NavComponent from "../components/Navbar"
import PasswordConfirmationModal from "../components/PasswordConfirmModal";
import OwnedFileList from "../components/OwnedFileList"; 
import AuthorizedFileList from "../components/AuthorizedFileList";

import { authorizeRequest, getAuthorizationList, revokeAuthorizationRequest, getUserList } from "../utils/fileHandler";
import { authorizeAccessor, revokeAccessor } from "../utils/web3Helper";
import { useWriteContract, } from 'wagmi'

import ChartComponent from "../components/Charts";
import Notification from "../components/NotificationComponent";




const AuthorizationList = ({authorizationList, handleOpenModal}) => {
  
  return (
    <Container className="mb-3 mt-3" style={{height: '100%', maxHeight: '100%', overflowY: 'scroll'}}> 
      <ListGroup>
        {authorizationList.map((item) => (
          <ListGroup.Item key={item.accessorId} className="d-flex justify-content-between text mb-3 shadow rounded">
            {item.name}
            <Button onClick={(e) => handleOpenModal({event: e, accessor: item})}>Revoke</Button>
          </ListGroup.Item>
        ))}
      </ListGroup>
    </Container>
  )
}


const Home = () => {
  const [ authorizationList, setAuthorizationList ] = useState([]);
  const [ section, setSection ] = useState('authorization'); 
  const { authed, user } = AuthConsumer();
  const [ isModalOpen, setIsModalOpen] = useState(false);
  // React state to manage selected options
  const [ selectedUser, setSelectedUser] = useState();
  const [ revokedAccessor, setRevokedAccessor ] = useState(null);
  const [ userList, setUserList ] = useState([]);
  const [ optionList, setOptionList ] = useState([]);
  const { 
    data: hash, 
    isPending, 
    writeContractAsync, 
  } = useWriteContract() 
  const navigate = useNavigate();
  
  const handleAuthorize = async ({confirmedPassword}) => {
    const accessor = userList.find((user) => user.userId === selectedUser.value);
    if (user.userId == null || accessor === null) return; 
    if (accessor.key == user.key) return;

    const authorizeAccessorObject = authorizeAccessor({accessor: accessor.key, password: confirmedPassword, owner: user.key});
    try {
      await writeContractAsync(authorizeAccessorObject);
      await authorizeRequest({ownerId: user.key, accessorId: accessor.key}); 
    } catch (err){
      console.log(err);
    }
      
    setAuthorizationList([...authorizationList, {
      accessorId: accessor.userId, 
      accessorKey: accessor.key,
      name: accessor.name,
      isAuthorized: true
    }]); 
  }

  const handleRevoke = async ({confirmedPassword}) => {
    console.log(revokedAccessor);
    if (user.userId == null) return;

    const revokeAccessorObject = revokeAccessor({accessor: revokedAccessor.accessorKey, password: confirmedPassword, owner: user.key})
    try {
      await writeContractAsync(revokeAccessorObject)
      await revokeAuthorizationRequest({ownerId: user.key, accessorId: revokedAccessor.accessorKey})

    } catch (err) {
      console.log(err);
    }
    
    setAuthorizationList(list => list.filter((a) => a.accessorId !== revokedAccessor.accessorId))
    setRevokedAccessor(null);
  }

  const handleOpenModal = ({event, accessor}) => {
    event.preventDefault();
    setRevokedAccessor(accessor);
    setIsModalOpen(true);
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleConfirmPassword = (password) => {
    // Handle password confirmation logic here
    !revokedAccessor ? handleAuthorize({confirmedPassword: password}) : handleRevoke({confirmedPassword: password});
  };

  const handleSectionSelect = (sectionKey) => {
    setSection(sectionKey);
  }

  

  const loadAuthorizationList = async () => {
    try {
      const list = await getAuthorizationList({userId: user.userId});
      setAuthorizationList(list);
    } catch (err){
      console.log("Cannot get authorization list" + err)
    }
  }

  const loadUserList = async () => {
    try {
      const list = await getUserList();
      const filteredList = list.filter((item) => item.userId !== user.userId);
      const mappedList = filteredList.map((item) => {return {value: item.userId, label: item.name }})
      setUserList(list);
      setOptionList(mappedList);
    } catch (err){
      console.log("Fail to set user list" + err);
    }
  }

  // Function triggered on selection
  function handleSelect(data) {
    setSelectedUser(data);
  }

  useEffect(() => {
    if (!authed){
      navigate('/login');
    }

    if (!user.userId) return;
    loadAuthorizationList();
    loadUserList();
  },[]);

  useEffect(() => {
  }, [authorizationList])
  
  return (
    <Container fluid className="custom-container d-flex flex-row mx-0">
        <NavComponent user={user} handleSelect={handleSectionSelect} />
        <Container fluid className="d-flex flex-column mb-3 ms-5" style={{height: '100%'}}>
          
          { section === 'authorization' && optionList &&
            <Container className="mb-3 pt-4" style={{height: '80%'}}>
              
              <Select
                options={optionList}
                placeholder="Select user"
                value={selectedUser}
                onChange={handleSelect}
                isSearchable={true}
                styles={{
                  control: (styles, state) => (
                    { ...styles, 
                      backgroundColor: 'white', 
                      borderColor: '#070f25',
                      marginBottom: '0.3em',
                      paddingBottom: '0.5rem',
                      paddingTop: '0.5rem' }),
                  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
                    return {
                      ...styles,
                      color: '#000',
                      backgroundColor: isFocused ? '#d1d2d7' : 'white'
                    };
                },}}
              />
              <Fragment>
                <Button style={{width: '100%'}} variant="primary" type="submit" onClick={(e) => handleOpenModal({event: e})}>
                    Authorize
                </Button>
              </Fragment>
                
              {authorizationList.length > 0 ? 
              <AuthorizationList authorizationList={authorizationList} handleRevoke={handleRevoke} handleOpenModal={handleOpenModal}/>
              :
              <Container fluid className="mt-3">
                <Alert variant='light'>You have not authorized anyone</Alert> 
              </Container>}
          </Container>
          }

          { section === 'my-files' && <OwnedFileList owner={{ userId: user.userId, key: user.key}}/> }

          { section === 'authorized-files' && <AuthorizedFileList accessor={{ userId: user.userId, key: user.key}}/>}
        
          { section === 'notification' && <Notification />}

        </Container>
      
      
      
      <PasswordConfirmationModal
        show={isModalOpen}
        onHide={handleCloseModal}
        onConfirm={handleConfirmPassword}
      />      
    </Container>
      
     
  );
}

export default Home;