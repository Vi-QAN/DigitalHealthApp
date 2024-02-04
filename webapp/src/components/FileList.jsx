/* eslint-disable no-console */
import React, { useState, useEffect, Fragment} from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse } from 'react-bootstrap';
import { Lock, Unlock } from 'react-bootstrap-icons';

import FileUploadModal from '../modals/FileUploadModal';
import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { saveEncryptedFiles, getEncryptedFile } from '../utils/fileHandler';
import DWVModal from '../modals/DWVModal';
import HL7FileModal from '../modals/HL7FileModal';

export const FileList = ({fileList, ipfs, owner, accessor}) => {
    const [isDWVModalOpen, setIsDWVModalOpen] = useState(false);
    const [isHL7FileModalOpen, setIsHL7FileModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [HL7Content, setHL7Content] = useState(null);

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

    const handleDownloadFile = async (e, item) => {
        e.preventDefault()
        try {
          if (item.fileExtension === 'hl7'){
            const result = await getEncryptedFile(item.fileHash,item.fileExtension, owner.key, accessor.key);
            setHL7Content(result);
            handleOpenHL7Modal();
          } else {
            const { blob, fileName} = await getEncryptedFile(item.fileHash, item.fileExtension, owner.key, accessor.key);
            console.log(blob.type)
  
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

    useEffect(() => {
        if (!fileList) return;
    }, [fileList])

    return (
        <Fragment>
            {fileList && <ListGroup>
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
            </ListGroup>}
            

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
        </Fragment>
    )
}

export const AddFile = ({ipfs, owner, accessor}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddFile = (files, encrypt) => {
        const formData = new FormData();
        
        for (let i = 0; i < files.length; i++) {
            formData.append('files', files[i]);
        }
        
        formData.append('owner', JSON.stringify(owner));
        formData.append('accessor', JSON.stringify(accessor));
  
        if (!owner || !files) return;
        if (encrypt) {
            saveEncryptedFiles(formData)
        }
        else {
            saveToIpfs(files, ipfs)
        }     
    }

    return (
        <Fragment>
            <Button onClick={(e) => handleOpenModal(e)}>
                Add File
            </Button>
            <FileUploadModal
                show={isModalOpen}
                onHide={handleCloseModal}
                onAddFile={handleAddFile}
            />
        </Fragment>)
}





