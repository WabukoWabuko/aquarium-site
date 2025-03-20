import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews/', { withCredentials: true })
      .then(response => setReviews(response.data.slice(0, 3)))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container fluid style={{ position: 'relative' }}>
      <Carousel>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="/images/aquarium-banner.jpg" // Replace with your branded image in public/images/
            alt="Topher's Aquarium Banner"
            effect="blur"
            height={400}
          />
          <Carousel.Caption>
            <h1>🌊 Welcome to Topher's Aquarium</h1>
            <p>Your one-stop shop for all things aquatic!</p>
          </Carousel.Caption>
        </Carousel.Item>
      </Carousel>
      <Container>
        <Row className="my-4">
          <Col>
            <h2>About Us</h2>
            <p>
              Topher brings years of passion and expertise to aquarium care.
              From repairs to custom builds, we’ve got you covered!
            </p>
          </Col>
        </Row>
        <Row>
          <Col>
            <h2>Testimonials</h2>
            <Row>
              {reviews.map(review => (
                <Col md={4} key={review.id}>
                  <Card>
                    <Card.Body>
                      <Card.Text>{review.comment || 'Great service!'}</Card.Text>
                      <div>
                        {[...Array(review.rating)].map((_, i) => (
                          <span key={i} style={{ color: '#ffd700' }}>★</span>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </Col>
        </Row>
        {/* Animated bubbles */}
        <div className="bubble" style={{ left: '20%', top: '20%' }}></div>
        <div className="bubble" style={{ left: '40%', top: '60%' }}></div>
        <div className="bubble" style={{ left: '80%', top: '40%' }}></div>
      </Container>
    </Container>
  );
}
export default Home;
