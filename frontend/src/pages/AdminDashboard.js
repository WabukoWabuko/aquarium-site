import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('home');
  const [services, setServices] = useState([]);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [orders, setOrders] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({});
  const [csrfToken, setCsrfToken] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf/', { withCredentials: true });
        setCsrfToken(response.data.csrfToken);
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
        navigate('/');
      }
    };

    const fetchData = async () => {
      try {
        const [servicesRes, productsRes, reviewsRes, ordersRes] = await Promise.all([
          axios.get('http://localhost:8000/api/services/', { withCredentials: true }),
          axios.get('http://localhost:8000/api/products/', { withCredentials: true }),
          axios.get('http://localhost:8000/api/reviews/', { withCredentials: true }),
          axios.get('http://localhost:8000/api/orders/', { withCredentials: true }),
        ]);
        setServices(servicesRes.data);
        setProducts(productsRes.data);
        setReviews(reviewsRes.data);
        setOrders(ordersRes.data);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        if (error.response?.status === 403) {
          navigate('/');
        }
      }
    };

    fetchCsrfToken();
    fetchData();
  }, [navigate]);

  const handleAdd = (type) => {
    setFormData({ type });
    setShowModal(true);
  };

  const handleEdit = (item, type) => {
    setFormData({ ...item, type });
    setShowModal(true);
  };

  const handleDelete = async (id, type) => {
    if (window.confirm(`Are you sure you want to delete this ${type}?`) && csrfToken) {
      try {
        await axios.delete(`http://localhost:8000/api/${type}s/${id}/`, {
          withCredentials: true,
          headers: { 'X-CSRFToken': csrfToken },
        });
        if (type === 'service') setServices(services.filter(s => s.id !== id));
        if (type === 'product') setProducts(products.filter(p => p.id !== id));
        if (type === 'review') setReviews(reviews.filter(r => r.id !== id));
        if (type === 'order') setOrders(orders.filter(o => o.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Failed to delete item.');
      }
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!csrfToken) return;
    const url = formData.id
      ? `http://localhost:8000/api/${formData.type}s/${formData.id}/`
      : `http://localhost:8000/api/${formData.type}s/`;
    const method = formData.id ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url,
        data: formData,
        withCredentials: true,
        headers: { 'X-CSRFToken': csrfToken },
      });
      if (formData.type === 'service') {
        setServices(formData.id ? services.map(s => s.id === response.data.id ? response.data : s) : [...services, response.data]);
      }
      if (formData.type === 'product') {
        setProducts(formData.id ? products.map(p => p.id === response.data.id ? response.data : p) : [...products, response.data]);
      }
      setShowModal(false);
      setFormData({});
    } catch (error) {
      console.error('Save failed:', error);
      alert('Failed to save changes.');
    }
  };

  return (
    <Container fluid className="admin-dashboard">
      <Row>
        <Col md={3} className="sidebar">
          <Nav variant="pills" className="flex-column">
            <Nav.Link onClick={() => setActiveTab('home')}>Dashboard Home</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('services')}>Services</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('products')}>Products</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('reviews')}>Reviews</Nav.Link>
            <Nav.Link onClick={() => setActiveTab('orders')}>Orders</Nav.Link>
            <Nav.Link onClick={() => navigate('/')}>Logout</Nav.Link>
          </Nav>
        </Col>
        <Col md={9}>
          <h1>Admin Dashboard</h1>
          {activeTab === 'home' && (
            <Row>
              <Col md={3}><Card><Card.Body><Card.Title>Services</Card.Title><p>{services.length}</p></Card.Body></Card></Col>
              <Col md={3}><Card><Card.Body><Card.Title>Products</Card.Title><p>{products.length}</p></Card.Body></Card></Col>
              <Col md={3}><Card><Card.Body><Card.Title>Orders</Card.Title><p>{orders.length}</p></Card.Body></Card></Col>
              <Col md={3}><Card><Card.Body><Card.Title>Reviews</Card.Title><p>{reviews.length}</p></Card.Body></Card></Col>
            </Row>
          )}
          {activeTab === 'services' && (
            <>
              <Button onClick={() => handleAdd('service')} className="mb-3" disabled={!csrfToken}>+ Add Service</Button>
              <Table striped bordered hover>
                <thead><tr><th>Name</th><th>Price</th><th>Actions</th></tr></thead>
                <tbody>
                  {services.map(s => (
                    <tr key={s.id}>
                      <td>{s.name}</td><td>${s.price}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(s, 'service')}>Edit</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(s.id, 'service')}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {activeTab === 'products' && (
            <>
              <Button onClick={() => handleAdd('product')} className="mb-3" disabled={!csrfToken}>+ Add Product</Button>
              <Table striped bordered hover>
                <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Actions</th></tr></thead>
                <tbody>
                  {products.map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td><td>${p.price}</td><td>{p.stock}</td>
                      <td>
                        <Button variant="warning" size="sm" onClick={() => handleEdit(p, 'product')}>Edit</Button>{' '}
                        <Button variant="danger" size="sm" onClick={() => handleDelete(p.id, 'product')}>Delete</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </>
          )}
          {activeTab === 'reviews' && (
            <Table striped bordered hover>
              <thead><tr><th>Rating</th><th>Comment</th><th>Actions</th></tr></thead>
              <tbody>
                {reviews.map(r => (
                  <tr key={r.id}>
                    <td>{r.rating} ★</td><td>{r.comment}</td>
                    <td><Button variant="danger" size="sm" onClick={() => handleDelete(r.id, 'review')}>Delete</Button></td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          {activeTab === 'orders' && (
            <Table striped bordered hover>
              <thead><tr><th>Name</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.customer_name}</td><td>${o.total}</td><td>{o.payment_status}</td>
                    <td>
                      <Button variant="warning" size="sm" onClick={() => handleEdit(o, 'order')}>Edit</Button>{' '}
                      <Button variant="danger" size="sm" onClick={() => handleDelete(o.id, 'order')}>Delete</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Col>
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{formData.id ? 'Edit' : 'Add'} {formData.type}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSave}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Description</Form.Label>
              <Form.Control as="textarea" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
            </Form.Group>
            <Form.Group>
              <Form.Label>Price</Form.Label>
              <Form.Control type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required />
            </Form.Group>
            {formData.type === 'product' && (
              <Form.Group>
                <Form.Label>Stock</Form.Label>
                <Form.Control type="number" value={formData.stock || ''} onChange={(e) => setFormData({ ...formData, stock: e.target.value })} required />
              </Form.Group>
            )}
            <Button type="submit" variant="primary" disabled={!csrfToken}>Save</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}
export default AdminDashboard;
