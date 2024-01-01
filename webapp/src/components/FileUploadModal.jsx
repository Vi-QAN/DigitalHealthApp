import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';


const FileUploadModal = ({ show, onHide, onAddFile }) => {
    const [ files, setFiles] = useState(null)
    const [ encrypt, setEncrypt ] = useState(false);

    const captureFile = (event) => {
        event.preventDefault()
        setFiles(event.target.files);
    }

    const handleAddFile = (e) => {
        e.preventDefault();
        onAddFile(files, encrypt);
    }
    
    // Clear the password field when the modal opens
    useEffect(() => {
        setFiles(null);
    }, [show]);


  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add File</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3" >
            <Form.Label>Input File</Form.Label>
            <Form.Control type="file" name='input-file' id='input-file' onChange={(e) => captureFile(e)}/>
          </Form.Group>
          <Form.Switch label='Encryption' onChange={(e) => setEncrypt(state => !state)} />
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" type="submit" onClick={(e) => handleAddFile(e)}>
          Add File
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default FileUploadModal;
