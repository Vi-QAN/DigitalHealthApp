import React, { useState, useEffect, Fragment, } from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse,Accordion } from 'react-bootstrap';

import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { getFileInfoByAccessor, } from '../utils/fileHandler';

import { AddFile, FileList } from './FileList';

const AuthorizedFileList = ({ipfs, accessor}) => {
    const [ fileList, setFileList ] = useState([]);
  
    const loadFileList = async () => {
      const list = await getFileInfoByAccessor(accessor.userId);
      console.log(list)
      setFileList(list)
    }

    useEffect(() => {
     loadFileList();
    }, [])
  
    return (
      <Container className='mb-3'>
        { fileList.length > 0 ? 
          <Fragment>
            <Form.Label>Authorized File List</Form.Label>
            <Accordion >
      
            {fileList.map((item, index) => (
                <Accordion.Item key={index} eventKey={index}>
                    <Accordion.Header className='d-flex '>
                      <Container className='d-flex col'>{item.userName}</Container>
                      <Container className='d-flex col-10 justify-content-end'>
                        <AddFile ipfs={ipfs} owner={{userId: item.ownerId, key: item.key}} accessor={accessor}/>

                      </Container>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FileList fileList={item.informationList} owner={{userId: item.ownerId, key: item.key}} accessor={accessor} />
                    </Accordion.Body>
                </Accordion.Item>
                
            ))}
            </Accordion>

          
          </Fragment> 
          :
          <Alert variant='light'>You have not been authorized for any file</Alert>
        }
        
      </Container>
    )
}

export default AuthorizedFileList;

