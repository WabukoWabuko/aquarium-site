import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import Review from '../components/Review';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services/', { withCredentials: true })
      .then(response => {
        setServices(response.data);
      })
      .catch(error => console.error(error));
  }, []);

  const addToRecentlyViewed = (service) => {
    const item = { id: service.id, name: service.name, price: service.price, type: 'service' };
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [item, ...stored.filter(i => i.id !== item.id)].slice(0, 5); // Keep top 5
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  // Hardcoded recommendations (mock for now)
  const recommendations = [
    { id: 999, name: 'Tank Cleaning', price: 50 },
    { id: 998, name: 'Water Testing', price: 20 },
  ];

  return (
    <Container>
      <h1>Our Services</h1>
      <Row>
        {services.map(service => (
          <Col md={4} key={service.id}>
            <Card onClick={() => addToRecentlyViewed(service)}>
              {service.image && (
                <LazyLoadImage
                  variant="top"
                  src={service.image}
                  alt={service.name}
                  effect="blur"
                  height={200}
                />
              )}
              <Card.Body>
                <Card.Title>{service.name}</Card.Title>
                <Card.Text>{service.description}</Card.Text>
                <p>Price: ${service.price}</p>
                <Review serviceId={service.id} />
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
      <Row className="my-4">
        <Col>
          <h2>Recommended Services</h2>
          <Row>
            {recommendations.map(rec => (
              <Col md={4} key={rec.id}>
                <Card>
                  <Card.Body>
                    <Card.Title>{rec.name}</Card.Title>
                    <Card.Text>Price: ${rec.price}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}
export default Services;
