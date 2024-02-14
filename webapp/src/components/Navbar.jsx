import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import { BsQuestionCircle, BsFileMedical, BsPeople   } from "react-icons/bs";
import { LuFileKey2 } from "react-icons/lu";
import { IoIosLogOut } from "react-icons/io";
import { AuthConsumer } from '../hooks/useAuth';

const NavComponent = ({ user, handleSelect }) => {
  const { logout } = AuthConsumer();
  const navigate = useNavigate();

  const onSelect = (key, e) => {
    e.preventDefault();
    if (key ==='logout') logout();
    handleSelect(key);
  }
  useEffect(() => {
    console.log(user)
  },[])

  return(
    <Navbar  className="d-flex flex-column col-2 border border-start-0 rounded-end py-2 px-3">
      <Navbar.Brand className="mb-4 mt-3" href="#">Medical Sharing</Navbar.Brand>
      <Nav  variant="pills" defaultActiveKey="authorization" className="d-flex flex-column col-12" onSelect={(key, e) => onSelect(key, e)}>
        <Nav.Item >

          <Nav.Link eventKey="authorization"><BsPeople />Authorize People</Nav.Link>
        </Nav.Item>
        <Nav.Item >
          <Nav.Link eventKey="my-files"><BsFileMedical />Manage Your Files</Nav.Link>
        </Nav.Item>
        <Nav.Item >
          <Nav.Link  eventKey="authorized-files"><LuFileKey2 />Shared Files</Nav.Link>
        </Nav.Item>
        <Nav.Item >
          <Nav.Link  eventKey="help"><BsQuestionCircle /> Help</Nav.Link>
        </Nav.Item>
        <Nav.Item >
          <Nav.Link eventKey="logout"><IoIosLogOut />Logout</Nav.Link>
        </Nav.Item>
      </Nav>
        
    </Navbar>
    )
}

export default NavComponent;