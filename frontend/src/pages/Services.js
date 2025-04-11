import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Helmet } from 'react-helmet-async';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';
import Review from '../components/Review';

function Services() {
  const [services, setServices] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/services/', { withCredentials: true })
      .then(response => setServices(response.data))
      .catch(error => console.error(error));
  }, []);

  const addToRecentlyViewed = (service) => {
    const item = { id: service.id, name: service.name, price: service.price, type: 'service' };
    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    const updated = [item, ...stored.filter(i => i.id !== item.id)].slice(0, 5);
    localStorage.setItem('recentlyViewed', JSON.stringify(updated));
  };

  const schemaOrg = services.map(service => ({
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": service.name,
    "provider": {
      "@type": "Organization",
      "name": "Topher's Aquarium Services"
    },
    "description": service.description,
    "offers": {
      "@type": "Offer",
      "price": service.price,
      "priceCurrency": "USD"
    }
  }));

  return (
    <Container>
      <Helmet>
        <title>Topher's Aquarium Services - Our Services</title>
        <meta name="description" content="Explore expert aquarium services including maintenance, repairs, and custom builds at Topher's Aquarium." />
        <meta name="keywords" content="aquarium services, maintenance, repairs, custom builds, Topher" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
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
          <h2>Service Area</h2>
          <p>We serve nationwide! Check our <a href="https://www.google.com/maps" target="_blank" rel="noopener noreferrer">coverage map</a> for details.</p>
        </Col>
      </Row>
    </Container>
  );
}
export default Services;
