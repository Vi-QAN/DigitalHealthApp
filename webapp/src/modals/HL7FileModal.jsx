import React, { useState, useEffect } from 'react';
import { Modal, Accordion } from 'react-bootstrap';

const HL7FileModal = ({ show, onHide, content }) => {

    // Clear the password field when the modal opens
    useEffect(() => {
      if (!content) return;
      console.log(content);
    }, [show, content]);

    return (
        <Modal show={show} onHide={onHide} >
            <Modal.Header closeButton>
                {content && <Modal.Title>{content.admissionContent.messageType}</Modal.Title>}
            </Modal.Header>
            <Modal.Body>
                {content && (<Accordion>
                    {Object.entries(content.admissionContent).map(([key, value]) => {
                        return (
                            key !== "messageType" && <Accordion.Item key={key} eventKey={key}>
                                <Accordion.Header>{key.charAt(0).toUpperCase() + key.slice(1)}</Accordion.Header>
                                <Accordion.Body>
                                    {key === "admissionReason" ? value : value.join(', ')}
                                </Accordion.Body>
                            </Accordion.Item>
                        )
                    })}
                    
                    
                </Accordion>)}
            </Modal.Body>
        
        </Modal>
  );
};

export default HL7FileModal;
