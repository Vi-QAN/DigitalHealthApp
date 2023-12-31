import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';


const NavComponent = ({ user }) => {
  const navigate = useNavigate();
  useEffect(() => {
    console.log(user)
  },[])

  return(
      <>
      {[false].map((expand) => (
          <Navbar key={expand} expand={expand} className="bg-body-tertiary mb-3">
            <Container fluid>
              <Navbar.Brand href="#">Medical Sharing</Navbar.Brand>
              <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${expand}`} />
              <Navbar.Offcanvas
                id={`offcanvasNavbar-expand-${expand}`}
                aria-labelledby={`offcanvasNavbarLabel-expand-${expand}`}
                placement="end"
              >
                <Offcanvas.Header closeButton>
                  <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${expand}`}>
                    Medical Sharing
                  </Offcanvas.Title>
                </Offcanvas.Header>
                <Offcanvas.Body>
                  <Nav activeKey="/" onSelect={(selected) => navigate(selected, {state: user })} className="justify-content-end flex-grow-1 pe-3">
                    <Nav.Link eventKey="/">Home</Nav.Link>
                    <Nav.Link eventKey="/test">Test</Nav.Link>
                    <Nav.Link eventKey="/file">File</Nav.Link>

                  </Nav>
                </Offcanvas.Body>
              </Navbar.Offcanvas>
            </Container>
          </Navbar>
        ))}
      </>
    )
}

export default NavComponent;