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
      <Container className='mb-3'> 
        {fileList.length > 0 ? 
          <Fragment>
            <Fragment>
              <Form.Label>Owned File List</Form.Label>
              <AddFile ipfs={ipfs} owner={owner} accessor={owner}/>
            </Fragment>
            <FileList fileList={fileList} ipfs={ipfs} owner={owner} accessor={owner} />
            
          </Fragment> : 
            <Alert variant='light'>You have not been authorized for any file </Alert>
            
        }
        
      </Container>        
    )
}

export default OwnedFileList;