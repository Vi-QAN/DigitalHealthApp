/* eslint-disable no-console */
import React, { useState, useEffect, Fragment} from 'react';
import {Button, Container, ListGroup, } from 'react-bootstrap';
import { Avatar } from '@mui/material';

import FileUploadModal from '../modals/FileUploadModal';
import HL7FileModal from '../modals/HL7FileModal';
import ChartComponent from './Charts';

import { downloadFromIPFS, saveToIpfs  } from '../utils/IPFSHandler';
import { saveEncryptedFiles, getHL7File, getRegularFile, savePlainFilesInformation, deleteFile } from '../utils/fileHandler';
import { LiaFileUploadSolid } from "react-icons/lia";
import { IoMdDownload, IoMdOpen } from "react-icons/io";
import { RiDeleteBin2Line } from "react-icons/ri";

import { useNavigate } from "react-router-dom";
import { IPFSConsumer } from '../hooks/useIPFS';

import { saveAs } from 'file-saver'

const OpenableFileExtenstionMapping = {
    "pdf" : { ipfs: true, server: true},
    "png" : { ipfs: true, server: true},
    "jpg" : { ipfs: true, server: true},
    "pptx": { ipfs: true, server: true},
    "dcm" : { ipfs: false, server: true},
    "hl7" : { ipfs: false, server: true},
    "docx" : { ipfs: false, server: true},
    "xlsx" : { ipfs: false, server: true}
}



export const FileList = ({fileList, owner, accessor}) => {
    // const { ipfs } = IPFSConsumer();
    const [isHL7FileModalOpen, setIsHL7FileModalOpen] = useState(false);
    const [HL7Content, setHL7Content] = useState(null);
    const [ isChartModalOpen, setIsChartModalOpen ] = useState()
    const [ chartContent, setChartContent ] = useState(null);
    const navigate = useNavigate();
  
    const handleOpenHL7Modal = () =>{
        setIsHL7FileModalOpen(true);
    }

    const handleCloseHL7Modal = () => {
        setIsHL7FileModalOpen(false);
    }

    const handleOpenChartModal = () => {
        setIsChartModalOpen(true);
    }

    const handleCloseChartModal = () => {
        setIsChartModalOpen(false);
    }

    const handleOpenFile = async (e, item) => {
        e.preventDefault();
        try {
            // if (item.fileMode === 'Public' && OpenableFileExtenstionMapping[item.fileExtension].ipfs){
            //     const fileURL = await downloadFromIPFS(ipfs, item);
            //     window.open(fileURL)
            //     URL.revokeObjectURL(fileURL);
            // } 
            // else {   
                if (item.fileExtension === 'dcm') {
                    const uri = `/dicom/?fileHash=${item.fileHash}&owner=${owner.key}&accessor=${accessor.key}`;
                    navigate(uri);
                    return;
                } else if (item.fileExtension === 'hl7'){
                    const result = await getHL7File(item.fileHash, owner.key, accessor.key);
                    setHL7Content(result);
                    handleOpenHL7Modal();
                } else if (item.fileExtension === 'json') {
                    const { blob, fileName } = await getRegularFile(item.fileHash, owner.key, accessor.key);
                    const reader = new FileReader();

                    reader.onload = function() {
                        setChartContent(JSON.parse(this.result));
                    };
                    
                    reader.readAsText(blob);
                    handleOpenChartModal();
                } else {
                    const { blob, fileName } = await getRegularFile(item.fileHash, owner.key, accessor.key);
                    const fileURL = URL.createObjectURL(blob);
                    window.open(fileURL)
                    URL.revokeObjectURL(fileURL);
                }
            // }
  
        } catch (err) {
            console.error(err)
        }
    }

    const handleDownloadFile = async (e, item) => {
        // if (item.fileMode === 'Public'){
        //     const fileURL = await downloadFromIPFS(ipfs, item);
        //     window.open(fileURL)
        //     saveAs(fileURL, item.fileName + '.' + item.fileExtension )
        // } else {
            const { blob, fileName } = await getRegularFile(item.fileHash, owner.key, accessor.key);
            const fileURL = URL.createObjectURL(blob);
            window.open(fileURL)
            URL.revokeObjectURL(fileURL);
        // }
    }

    const handleDeleteFile = async (e, item) => {
        const result = await deleteFile(item.fileId);
        console.log(result);
    }

    const actionMapping = {
        "Download" : { 
            method: handleDownloadFile, 
            icon: <IoMdDownload className='icon theme'/> },
        "Open" : { 
            method: handleOpenFile, 
            icon: <IoMdOpen className='icon theme'/>  },
        "Remove" : {
            method: handleDeleteFile,
            icon: <RiDeleteBin2Line className='icon theme' />
        }
    }

    useEffect(() => {
        if (!fileList) return;
    }, [fileList])

    return (
        <Container style={{height: '85%'}}>
            <Container fluid className="d-flex flex-row mb-2">
                <Container className="col-3">Date Added</Container>
                <Container className="col-5">File Name</Container>
                <Container className="col-1">File Mode</Container>
                <Container className="d-flex col-3 justify-content-center">Actions</Container>
            </Container>
            {fileList && <ListGroup >
                {fileList.map((item, index) => {
                    const date = new Date(item.addedDate);
                    return (
                    <ListGroup.Item key={index} className="d-flex mb-3 justify-content-around shadow rounded">  
                        <Container className="align-items-center col-3">
                            {`${date.toLocaleDateString()} ${date.toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}` }
                            
                        </Container>
                        
                        <Container className='col-5' style={{maxWidth: '50%'}}>
                            {item.fileName + '.' + item.fileExtension}
                    
                        </Container>
                        <Container className='col-1'>
                            {item.fileMode}
                        </Container>
                        <Container className="d-flex flex-row col-3 justify-content-around align-items-center">
                            {item.fileActions.map(a => {
                                if (a.name === 'Remove' && owner.userId !== accessor.userId) return;
                                const mapped = actionMapping[a.name];
                                if (!mapped) return;
                
                                return (
                                    <Avatar className="action-icon" key={a.id} sx={{ bgcolor: 'transparent' }}>
                                        <Button 
                                        style={{
                                            backgroundColor:'transparent', 
                                            width: 'auto',
                                            boxShadow: 'none',
                                            justifyContent: 'center', 
                                            alignItems: 'center'}} 
                                        
                                        className=' col-3 rounded-circle' 
                                        onClick={(e) => mapped.method(e, item)}>{mapped.icon}
                                        </Button>
                                    </Avatar>)
                            })}
                            
                        </Container>
                    </ListGroup.Item>
                )})}
            </ListGroup>}

            <HL7FileModal 
                show={isHL7FileModalOpen}
                onHide={handleCloseHL7Modal}
                content={HL7Content}
            />

            {chartContent && <ChartComponent
                show={isChartModalOpen}
                onHide={handleCloseChartModal}
                content={chartContent}
            />}
        </Container>
    )
}

export const AddFile = ({owner, accessor}) => {
    // const { ipfs } = IPFSConsumer(); 
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        setIsModalOpen(true);
    }
    
    const handleCloseModal = () => {
        setIsModalOpen(false);
    };

    const handleAddFile = async (files, encrypt) => {
        
  
        if (!owner || !files) return;
        if (encrypt) {
            const formData = new FormData();
        
            for (let i = 0; i < files.length; i++) {
                formData.append('files', files[i]);
            }
        
            formData.append('owner', JSON.stringify(owner));
            formData.append('accessor', JSON.stringify(accessor));
            saveEncryptedFiles(formData)
        }
        // else {
        //     const result = await saveToIpfs(files, ipfs)
        //     const file = result.file;
        //     const fileHash = result.path;
        //     const metaData = {
        //         fileHash: fileHash,
        //         multiAddress: '/ip4/127.0.0.1/tcp/5001',
        //         fileName: file.name,
        //         fileType: file.type.length > 0 ? file.type : 'application/octet-stream',
        //         ownerId: owner.userId,
        //         accessorId: accessor.userId
        //     }
        //     savePlainFilesInformation(metaData);
        // }     
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




