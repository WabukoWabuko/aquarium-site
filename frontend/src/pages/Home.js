import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Carousel, Card } from 'react-bootstrap';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { Helmet } from 'react-helmet-async';
import 'react-lazy-load-image-component/src/effects/blur.css';
import axios from 'axios';

function Home() {
  const [reviews, setReviews] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  useEffect(() => {
    axios.get('http://127.0.0.1:8000/api/reviews/', { withCredentials: true })
      .then(response => setReviews(response.data.slice(0, 3)))
      .catch(error => console.error(error));

    const stored = JSON.parse(localStorage.getItem('recentlyViewed') || '[]');
    setRecentlyViewed(stored.slice(0, 3));
  }, []);

  const schemaOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "Topher's Aquarium Services",
    "url": "http://localhost:3000",
    "logo": "http://localhost:3000/images/aquarium-banner-1-custom-tank.jpg",
    "description": "Your one-stop shop for aquarium services and products.",
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": "+254-700-123-456",
      "contactType": "Customer Service"
    }
  };

  return (
    <Container fluid style={{ position: 'relative' }}>
      <Helmet>
        <title>Topher's Aquarium Services - Home</title>
        <meta name="description" content="Welcome to Topher's Aquarium Services - your one-stop shop for custom tanks, fish, and maintenance!" />
        <meta name="keywords" content="aquarium, custom tanks, fish, maintenance, Topher" />
        <script type="application/ld+json">{JSON.stringify(schemaOrg)}</script>
      </Helmet>
      <Carousel>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="/images/aquarium-banner1.jpg"
            alt="Custom Aquarium Tank"
            effect="blur"
            height={400}
          />
          <Carousel.Caption>
            <h1>🌊 Welcome to Topher's Aquarium</h1>
            <p>Explore our custom-built tanks!</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="/images/aquarium-banner2.jpg"
            alt="Colorful Fish"
            effect="blur"
            height={400}
          />
          <Carousel.Caption>
            <h1>🐠 Vibrant Aquatic Life</h1>
            <p>Find the perfect fish for your tank.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="/images/aquarium-banner3.jpg"
            alt="Aquarium Maintenance"
            effect="blur"
            height={400}
          />
          <Carousel.Caption>
            <h1>🛠️ Expert Services</h1>
            <p>From repairs to full setups, we’ve got you covered.</p>
          </Carousel.Caption>
        </Carousel.Item>
        <Carousel.Item>
          <LazyLoadImage
            className="d-block w-100"
            src="/images/aquarium-banner4.jpg"
            alt="Custom Aquarium Tank"
            effect="blur"
            height={400}
          />
          <Carousel.Caption>
            <h1>🌊 Welcome to Topher's Aquarium</h1>
            <p>Explore our custom-built tanks!</p>
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
        <Row className="why-choose-us">
          <Col>
            <h3>Why Choose Us?</h3>
            <Row>
              <Col md={4}>
                <p>🌟 Expert Craftsmanship</p>
              </Col>
              <Col md={4}>
                <p>🐟 Premium Aquatic Life</p>
              </Col>
              <Col md={4}>
                <p>🛠️ Reliable Support</p>
              </Col>
            </Row>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h2>Find Us</h2>
            <div className="map-container">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.835434509371!2d144.9537363153167!3d-37.81627997975146!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642af0f11fd81%3A0xf577d8f5d6f5e5e0!2sMelbourne%20Aquarium!5e0!3m2!1sen!2sus!4v1634567890123!5m2!1sen!2sus"
                title="Topher's Aquarium Location"
                allowFullScreen=""
                loading="lazy"
              ></iframe>
            </div>
            <p>Visit us in Melbourne or contact us for nationwide service!</p>
          </Col>
        </Row>
        <Row className="my-4">
          <Col>
            <h2>Recently Viewed</h2>
            {recentlyViewed.length > 0 ? (
              <Row>
                {recentlyViewed.map(item => (
                  <Col md={4} key={item.id}>
                    <Card>
                      <Card.Body>
                        <Card.Title>{item.name}</Card.Title>
                        <Card.Text>{item.type === 'service' ? 'Service' : 'Product'} - ${item.price}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Browse our shop or services to see items here!</p>
            )}
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
        <Row className="trust-section my-4">
          <Col>
            <h2>Trusted by Experts</h2>
            <div>
              <img src="/images/trust-logo-1.png" alt="Aquarium Expert" className="trust-logo" />
              <img src="/images/trust-logo-2.png" alt="Fish Care Pro" className="trust-logo" />
              <img src="/images/trust-logo-3.png" alt="Marine Life Assoc" className="trust-logo" />
            </div>
            <p>Join thousands of satisfied customers and industry leaders!</p>
          </Col>
        </Row>
        <div className="bubble" style={{ left: '20%', top: '20%' }}></div>
        <div className="bubble" style={{ left: '40%', top: '60%' }}></div>
        <div className="bubble" style={{ left: '80%', top: '40%' }}></div>
      </Container>
    </Container>
  );
}
export default Home;
