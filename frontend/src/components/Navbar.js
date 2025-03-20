import React, { useState } from 'react';
import { Navbar, Nav, Modal, Form, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSwipeable } from 'react-swipeable';

function CustomNavbar() {
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
      setCsrfToken(response.data.csrfToken);
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
      alert('Couldn’t load CSRF token. Please refresh and try again.');
    }
  };

  const handleModalOpen = () => {
    setShowLogin(true);
    fetchCsrfToken();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      alert('CSRF token not loaded yet. Please wait or try again.');
      fetchCsrfToken();
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost:8000/api/login/',
        { username, password },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrfToken,
            'Content-Type': 'application/json',
          },
        }
      );
      setCsrfToken(response.data.csrfToken);
      setShowLogin(false);
      setUsername('');
      setPassword('');
      navigate('/admin-dashboard');
    } catch (error) {
      console.error('Login failed:', error);
      alert('Oops, wrong details or server issue—try again!');
    }
  };

  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setExpanded(false),
    onSwipedRight: () => setExpanded(true),
    preventDefaultTouchmoveEvent: true,
  });

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg" expanded={expanded} onToggle={() => setExpanded(!expanded)}>
        <Navbar.Brand as={Link} to="/">Aquarium Services</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" {...swipeHandlers}>
          <Nav className="mr-auto">
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>Home</Nav.Link>
            <Nav.Link as={Link} to="/services" onClick={() => setExpanded(false)}>Services</Nav.Link>
            <Nav.Link as={Link} to="/shop" onClick={() => setExpanded(false)}>Shop</Nav.Link>
            <Nav.Link as={Link} to="/" onClick={() => setExpanded(false)}>About</Nav.Link>
            <Nav.Link onClick={() => { handleModalOpen(); setExpanded(false); }}>Admin Login</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>

      <Modal show={showLogin} onHide={() => setShowLogin(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Admin Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleLogin}>
            <Form.Group>
              <Form.Label>Username</Form.Label>
              <Form.Control
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="mt-2" disabled={!csrfToken}>
              {csrfToken ? 'Login' : 'Loading...'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default CustomNavbar;
