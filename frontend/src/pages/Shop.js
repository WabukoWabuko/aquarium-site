import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Helmet } from 'react-helmet-async';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';

function Shop() {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [csrfResponse, productsResponse] = await Promise.all([
          axios.get('http://localhost:8000/api/csrf/', { withCredentials: true }),
          axios.get('http://localhost:8000/api/products/', { withCredentials: true }),
        ]);
        setCsrfToken(csrfResponse.data.csrfToken);
        setProducts(productsResponse.data);
      } catch (err) {
        console.error('Failed to fetch data:', err);
        setError('Couldn’t load products or CSRF token.');
      }
    };
    fetchData();
  }, []);

  const handleBuy = (product) => {
    setSelectedProduct(product);
    setShowModal(true);
    addToRecentlyViewed(product);
  };

  const addToRecentlyViewed = (product) => {
    const item = { id: product.id, name: product.name, price: product.price, type: 'product' };
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [item, ...stored.filter(i => i.id !== item.id)].slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const handlePayment = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('CSRF token not loaded. Please refresh.');
      return;
    }

    const orderData = {
      customer_name: name,
      phone: phone,
      email: email,
      total: selectedProduct.price,
      payment_status: 'Pending',
    };

    try {
      const orderResponse = await axios.post('http://localhost:8000/api/orders/', orderData, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });
      const orderId = orderResponse.data.id;

      const paymentResponse = await axios.post('http://localhost:8000/api/orders/initiate_payment/', {
        phone,
        total: selectedProduct.price,
        order_id: orderId,
      }, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });

      console.log('Order created:', orderResponse.data);
      console.log('Payment response:', paymentResponse.data);
      alert('Check your phone for M-Pesa prompt!');
      setShowModal(false);
      setPhone('');
      setName('');
      setEmail('');
      setError(null);
    } catch (err) {
      console.error('Payment process failed:', err);
      if (err.response?.status === 400) {
        setError(`Payment failed: ${JSON.stringify(err.response.data)}`);
      } else if (err.response?.status === 403) {
        setError('Forbidden: Check login status or browser cookie settings.');
      } else {
        setError('Failed to process order: ' + (err.response?.statusText || 'Unknown error'));
      }
    }
  };

  const schemaOrg = products.map(product => ({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "USD",
      "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
    },
    "image": product.image || "http://localhost:3000/images/aquarium-banner-1-custom-tank.jpg"
  }));

  return (
    <Container>
      <Helmet>
        <title>Topher's Aquarium Services - Shop</title>
        <meta name="description" content="Shop aquariums, fish, and accessories at Topher's Aquarium Services." />
        <meta name="keywords" content="aquarium shop, fish tanks, aquarium supplies, Topher" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
      <h1>Shop Aquariums</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Row className="why-choose-us">
        <Col>
          <h3>Shipping Info</h3>
          <p>🚚 Fast Nationwide Shipping | 📦 Secure Packaging | ✅ Satisfaction Guaranteed</p>
        </Col>
      </Row>
      <Row>
        {products.map(product => (
          <Col md={4} key={product.id}>
            <Card>
              {product.image && (
                <LazyLoadImage
                  variant="top"
                  src={product.image}
                  alt={product.name}
                  effect="blur"
                  height={200}
                />
              )}
              <Card.Body>
                <Card.Title>{product.name}</Card.Title>
                <Card.Text>{product.description}</Card.Text>
                <p>Price: ${product.price}</p>
                <Button variant="primary" onClick={() => handleBuy(product)} disabled={!csrfToken}>
                  Buy Now
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Checkout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handlePayment}>
            <Form.Group>
              <Form.Label>Name</Form.Label>
              <Form.Control value={name} onChange={(e) => setName(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Phone (2547...)</Form.Label>
              <Form.Control value={phone} onChange={(e) => setPhone(e.target.value)} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Email</Form.Label>
              <Form.Control type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </Form.Group>
            <Button type="submit" variant="success" disabled={!csrfToken}>
              Pay ${selectedProduct?.price || '0'}
            </Button>
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
}

export default Shop;
