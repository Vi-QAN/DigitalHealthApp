import React, { useState, useEffect, Fragment, } from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse,Accordion } from 'react-bootstrap';
import { Lock, Unlock } from 'react-bootstrap-icons';

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
                    <Accordion.Header>{item.userName}
                      <AddFile ipfs={ipfs} owner={{userId: item.ownerId, key: item.key}} accessor={accessor}/>
                    </Accordion.Header>
                    <Accordion.Body>
                        <FileList fileList={item.informationList} owner={{userId: item.ownerId, key: item.key}} accessor={accessor} />
                    </Accordion.Body>
                </Accordion.Item>
                // <ListGroup.Item key={index}>
                //   <Container>
                //     <Button
                //       onClick={(e) => handleToggle(e, index)}
                //       aria-controls="collapse-info"
                //       aria-expanded={openItems[index].isOpened}
                //       className="mb-3 mr-3"
                //       disabled={!item.isAuthorized}
                //     >
                //       {item.userName}
                //     </Button>
                //     {!item.isAuthorized ? <Lock color="royalblue" size={20} className="align-right"/> : <Unlock color="royalblue" size={20} className="align-right" />}
                //     <AddFile ipfs={ipfs} owner={{userId: item.ownerId, key: item.key}} accessor={accessor}/>
                //   </Container>
                  
                //   <Collapse in={openItems[index].isOpened}>
                //     <Container id="collapse-info">
                //       {item.informationList.map((item, index) => (
                //         <Container key={index} className="mb-2">
                //           <a href={'http://127.0.0.1:8080/ipfs/' + item.fileHash}> 
                //           {
                //             item.fileName + '.' + item.fileExtension
                          
                //           } </a>
                //         </Container>
                //       ))}
                      
                //     </Container>
                //   </Collapse>
                    
                // </ListGroup.Item>
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

