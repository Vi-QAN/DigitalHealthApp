import React, { useState, useEffect, Fragment, } from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse,Accordion } from 'react-bootstrap';

import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { getFileInfoByAccessor, } from '../utils/fileHandler';

import { AddFile, FileList } from './FileList';

const AuthorizedFileList = ({accessor}) => {
    const [ fileList, setFileList ] = useState([]);
    const [ activeItem, setActiveItem ] = useState(null);
  
    const loadFileList = async () => {
      const list = await getFileInfoByAccessor(accessor.userId);
      console.log(list)
      setFileList(list)
    }

    const onAddFile = (addedList) => {
      let newFileList = fileList;
      const infoList = newFileList[activeItem]['informationList']
      const newInfoList = [ ...infoList, ...addedList ];
      newFileList[activeItem] = newInfoList;
      setFileList(newFileList);
    }

    useEffect(() => {
     loadFileList();
    }, [])
  
    return (
      <Container className='mb-3 pt-4' style={{height: '100%', maxHeight: '100%', overflowY: 'scroll'}}>
        { fileList.length > 0 ? 
          <Fragment>
            <Form.Label style={{ height: '50px', fontWeight: '500', fontSize: '18px'}}>Authorized File List</Form.Label>
            <Accordion style={{maxHeight: '100%'}}>
      
            {fileList.map((item, index) => (
              <Accordion.Item  key={index} eventKey={index} >
                  <Accordion.Header className='d-flex '>
                    <Container className='d-flex col'>{item.userName}</Container>
                    <Container className='d-flex col-10 justify-content-end' onClick={() => setActiveItem(index)}>
                      <AddFile owner={{userId: item.ownerId, key: item.key}} accessor={accessor} onAddFile={onAddFile}/>

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

