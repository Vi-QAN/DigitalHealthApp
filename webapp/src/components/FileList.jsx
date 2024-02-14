/* eslint-disable no-console */
import React, { useState, useEffect, Fragment} from 'react';
import {Button, Container, Form, ListGroup, Alert, Collapse} from 'react-bootstrap';

import FileUploadModal from '../modals/FileUploadModal';
import { downloadFromIPFS, saveToIpfs } from '../utils/IPFSHandler';
import { saveEncryptedFiles, getEncryptedFile } from '../utils/fileHandler';
import DWVModal from '../modals/DWVModal';
import HL7FileModal from '../modals/HL7FileModal';
import { LiaFileUploadSolid } from "react-icons/lia";

import { useNavigate } from "react-router-dom";


export const FileList = ({fileList, ipfs, owner, accessor}) => {
    const [isDWVModalOpen, setIsDWVModalOpen] = useState(false);
    const [isHL7FileModalOpen, setIsHL7FileModalOpen] = useState(false);
    const [file, setFile] = useState(null);
    const [HL7Content, setHL7Content] = useState(null);
    const navigate = useNavigate();

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
            const uri = `/dicom/?fileHash=${item.fileHash}&owner=${owner.key}&accessor=${accessor.key}`;
            navigate(uri);
            // const { blob, fileName} = await getEncryptedFile(item.fileHash, item.fileExtension, owner.key, accessor.key);
            // console.log(blob.type)
  
            // const file = new File([blob], fileName, { type: blob.type });
  
            // setFile(file);
            // handleOpenDWVModal();
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
        <Container style={{height: '85%'}}>
            <Container fluid className="d-flex flex-row mb-2">
                <Container className="col-3">Date Added</Container>
                <Container className="col-6">File Name</Container>
                <Container className="col-3">Actions</Container>
            </Container>
            {fileList && <ListGroup >
                {fileList.map((item) => (
                    <ListGroup.Item key={item.fileHash} className="d-flex justify-content-around">  
                        <Container className="d-flex align-items-center col-3">Today</Container>
                        
                        <Container className='col-6'>
                            <a  href={'http://127.0.0.1:8080/ipfs/' + item.fileHash}> 
                            { item.fileName.search(/\./) == -1 ? 
                                item.fileName + '.' + item.fileExtension
                                :
                                item.fileName
                            } </a>
                        </Container>
                        
                        
                        <Button className='col-3' onClick={(e) => handleDownloadFile(e, item)}>Download</Button>
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
        </Container>
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
                <LiaFileUploadSolid />Add File
            </Button>
            <FileUploadModal
                show={isModalOpen}
                onHide={handleCloseModal}
                onAddFile={handleAddFile}
            />
        </Fragment>)
}





