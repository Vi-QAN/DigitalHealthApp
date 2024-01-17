/* eslint-disable no-console */
import React, { useState, useEffect, Fragment} from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse } from 'react-bootstrap';
import { Lock, Unlock } from 'react-bootstrap-icons';

import FileUploadModal from '../modals/FileUploadModal';
import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { saveEncryptedFiles, getFileInfoByOwner, getFileInfoByAccessor, getEncryptedFile } from '../utils/fileHandler';
import DWVModal from '../modals/DWVModal';
import HL7FileModal from '../modals/HL7FileModal';

export const AuthorizedFileList = ({ipfs, accessor}) => {
  const [ fileList, setFileList ] = useState([]);
  const [ openItems, setOpenItems ] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [ owner, setOwner ] = useState(null);

  const handleToggle = (e, index) => {
    e.preventDefault();
    const updatedOpenItems = [...openItems];
    updatedOpenItems[index].isOpened = !updatedOpenItems[index].isOpened;
    setOpenItems(updatedOpenItems);
  };

  const handleClick = (e, item) => {
    e.preventDefault();
    try {
    } catch (err) {
      console.error(err)
    }
  }

  const loadFileList = async () => {
    const list = await getFileInfoByAccessor(accessor.userId);
    setFileList(list)
    const openItems = list.map((item) => { return { ...item, isOpened: false }});
    setOpenItems(openItems);
    console.log(openItems);
  }

  const handleOpenModal = (e, user) => {
    e.preventDefault();
    setIsModalOpen(true);
    setOwner(user)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleAddFile = (files, encrypt) => {
    console.log(encrypt);

    const formData = new FormData();
    formData.append('file', files);
    formData.append('owner', JSON.stringify(owner));
    formData.append('accessor', JSON.stringify(accessor));

    if (!owner || !files) return;
    if (encrypt)
      saveEncryptedFiles(formData)
    else {
      saveToIpfs(files, ipfs)
    }
     
    try {
        // const addedFile = saveToIpfs(files, ipfs);

        // const metadata = {
        //     "OwnerId": userId,
        //     "FileHash": addedFile.cid.toString(),
        //     "MultiAddress": "/ip4/127.0.0.1/tcp/5001",
        //     "FileName": file.name,
        //     "FileType": file.type
        // }

        //savePlainFiles(metadata);

        // setFileList((list) => 
        // [...list, 
        //   { fileName: file.name, 
        //     fileHash: added.cid.toString(),
        //     fileType: file.type
        //   }])

    } catch(err){}
  };

  useEffect(() => {
   loadFileList();
  }, [])

  return (
    <Container className='mb-3'>
      { fileList.length > 0 ? 
        <Fragment>
        <Form.Label>Authorized File List</Form.Label>
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
                  <Button onClick={(e) => handleOpenModal(e, { userId: item.ownerId, key: item.key})}>
                    Add File
                  </Button>
                </Container>
                
                <Collapse in={openItems[index].isOpened}>
                  <Container id="collapse-info">
                    {item.informationList.map((item, index) => (
                      <Container key={index} className="mb-2">
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
        
        </Fragment> 
        :
        <Alert variant='light'>You have not been authorized for any file</Alert>
      }
      <FileUploadModal
          show={isModalOpen}
          onHide={handleCloseModal}
          onAddFile={handleAddFile}
        />
    </Container>
  )
}

export const OwnedFileList  = ({ipfs, owner}) => {
    const [fileList, setFileList] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDWVModalOpen, setIsDWVModalOpen] = useState(false);
    const [isHL7FileModalOpen, setIsHL7FileModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [HL7Content, setHL7Content] = useState(null);

    const handleOpenModal = (e) => {
      e.preventDefault();
      setIsModalOpen(true);
    }
  
    const handleCloseModal = () => {
      setIsModalOpen(false);
    };

    const handleOpenDWVModal = () =>{
      setIsDWVModalOpen(true);
    }

    const handleCloseDWVModal = () => {
      setIsDWVModalOpen(false);
    }

    const handleOpenHL7Modal = () =>{
      setIsHL7FileModalOpen(true);
    }

    const handleCloseHL7Modal = () => {
      setIsHL7FileModalOpen(false);
    }
  
    const handleAddFile = (files, encrypt) => {
      const formData = new FormData();
      
      for (let i = 0; i < files.length; i++) {
        formData.append('files', files[i]);
      }
      
      formData.append('owner', JSON.stringify(owner));
      formData.append('accessor', JSON.stringify(owner));

      if (!owner || !files) return;
      if (encrypt) {
        saveEncryptedFiles(formData)
      }
      else {
        saveToIpfs(files, ipfs)
      } 
      
    }

    const handleDownloadFile = async (e, item) => {
      e.preventDefault()
      try {
        if (item.fileExtension === 'hl7'){
          const result = await getEncryptedFile(item.fileHash,item.fileExtension, owner.key, owner.key);
          setHL7Content(result);
          handleOpenHL7Modal();
        } else {
          const { blob, fileName} = await getEncryptedFile(item.fileHash, item.fileExtension, owner.key, owner.key);

          const file = new File([blob], fileName, { type: blob.type });

          setFile(file);
          handleOpenDWVModal();
        }
        
        

        // Optionally, revoke the URL after opening
        // This is important to release resources
        // URL.revokeObjectURL(fileUrl);

      } catch (err) {
          console.error(err)
      }
    }

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
              <Button onClick={(e) => handleOpenModal(e)}>
                Add File
              </Button>
            </Fragment>
            
            <ListGroup>
              {fileList.map((item) => (
                <ListGroup.Item key={item.fileHash} className="d-flex justify-content-between">      
                  
                  <a href={'http://127.0.0.1:8080/ipfs/' + item.fileHash}> 
                    { item.fileName.search(/\./) == -1 ? 
                      item.fileName + '.' + item.fileExtension
                      :
                      item.fileName
                    } </a>
                    
                  <Button onClick={(e) => handleDownloadFile(e, item)}>Download</Button>
                </ListGroup.Item>
              ))}
            </ListGroup>
          </Fragment> : 
            <Alert variant='light'>You have not been authorized for any file 
              <Button onClick={(e) => handleOpenModal(e)}>
                Add File
              </Button>
            </Alert>
            
        }
        <FileUploadModal
          show={isModalOpen}
          onHide={handleCloseModal}
          onAddFile={handleAddFile}
        />

        <DWVModal 
         show={isDWVModalOpen}
         onHide={handleCloseDWVModal}
         file={file}
         />

         <HL7FileModal 
          show={isHL7FileModalOpen}
          onHide={handleCloseHL7Modal}
          content={HL7Content}
         />
      </Container>        
    )
}

