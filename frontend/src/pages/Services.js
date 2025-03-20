import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Review from '../components/Review';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services/', { withCredentials: true })
      .then(response => setServices(response.data))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container>
      <h1>Our Services</h1>
      <Row>
        {services.map(service => (
          <Col md={4} key={service.id}>
            <Card>
              {service.image && (
                <LazyLoadImage
                  variant="top"
                  src={service.image}
                  alt={service.name}
                  effect="blur"
                  height="200" // Adjust based on your design
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
    </Container>
  );
}
export default Services;
