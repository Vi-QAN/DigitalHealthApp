import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Nav } from 'react-bootstrap';

import DWVComponent from './DWV';
import TagsTable from './DWVTagsTable';



const DWVModal = ({ show, onHide, file }) => {
    const [ tab, setTab ] = useState('viewer');
    const [metaData, setMetaData] = useState({});

    const onSelect = (key, e) => {
        e.preventDefault();
        setTab(key);
    }

    const onMetaDataChange = (data) => {
      setMetaData(data)
    }

    // Clear the password field when the modal opens
    useEffect(() => {
      if (!file) return;
    }, [show, file, metaData]);



  return (
    <Modal show={show} fullscreen={true} onHide={onHide} >
      <Modal.Header closeButton>
        <Modal.Title>Viewer</Modal.Title>
      </Modal.Header>
        <Modal.Body>
            <Nav fill variant="tabs" defaultActiveKey="viewer" onSelect={(key, e) => onSelect(key,e)}>
                <Nav.Item>
                    <Nav.Link eventKey="viewer">Image</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                    <Nav.Link eventKey="tags">Tags</Nav.Link>
                </Nav.Item>
            </Nav>
            {tab === 'viewer' && <DWVComponent file={file} onMetaDataChange={onMetaDataChange}/>}
            {tab === 'tags' && metaData && <TagsTable data={metaData} />}
      </Modal.Body>
      
    </Modal>
  );
};

export default DWVModal;
