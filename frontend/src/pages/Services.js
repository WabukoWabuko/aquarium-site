import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import axios from 'axios';
import Review from '../components/Review';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services/')
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
              {service.image && <Card.Img variant="top" src={service.image} />}
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
