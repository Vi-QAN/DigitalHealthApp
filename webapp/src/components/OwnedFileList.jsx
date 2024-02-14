import React, { useState, useEffect, Fragment} from 'react';
import {Button, Container, Form, ListGroup, Alert } from 'react-bootstrap';

import FileUploadModal from '../modals/FileUploadModal';
import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { saveEncryptedFiles, getFileInfoByOwner, getFileInfoByAccessor, getEncryptedFile } from '../utils/fileHandler';
import DWVModal from '../modals/DWVModal';
import HL7FileModal from '../modals/HL7FileModal';
import { AddFile, FileList } from './FileList';

const OwnedFileList  = ({ipfs, owner}) => {
    const [fileList, setFileList] = useState([]);
    
    const loadFileList = async () => {
      const list = await getFileInfoByOwner(owner.userId);
      setFileList(list)
      console.log(list);
    }

    useEffect(() => {
      loadFileList();
    },[])
    return (
      <Fragment>
        
        <Container className='d-flex flex-column mb-3' style={{height: '100%'}}>
        { fileList.length > 0 ? 
          <FileList fileList={fileList} ipfs={ipfs} owner={owner} accessor={owner} />
          :
          <Alert variant='light'>You have not been authorized for any file </Alert>
        }
        </Container>
           
            
        
        <AddFile ipfs={ipfs} owner={owner} accessor={owner}/>

      </Fragment>
       
        
        
              
    )
}

export default OwnedFileList;