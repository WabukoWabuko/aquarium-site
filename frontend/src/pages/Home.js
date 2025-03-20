import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

function Home() {
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews/', { withCredentials: true })
      .then(response => setReviews(response.data.slice(0, 3)))
      .catch(error => console.error(error));
  }, []);

  return (
    <Container fluid>
      <Carousel>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="https://images.unsplash.com/photo-1570130811100-2ac024d53726?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=400&q=80" // Replace with your branded image
            alt="Aquarium Banner"
            effect="blur"
            height="400"
          />
          <Carousel.Caption>
            <h1>🌊 Welcome to Aquarium Services</h1>
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
        <div className="bubble" style={{ left: '20%' }}></div>
        <div className="bubble" style={{ left: '40%' }}></div>
        <div className="bubble" style={{ left: '60%' }}></div>
      </Container>
    </Container>
  );
}
export default Home;
