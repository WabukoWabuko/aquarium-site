import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Home() {
  return (
    <Container>
      <Row>
        <Col>
          <h1>🌊 Welcome to Aquarium Services</h1>
          <p>Dive into our world of aquarium care and equipment!</p>
          <div className="bubble" style={{ left: '20%' }}></div>
          <div className="bubble" style={{ left: '80%' }}></div>
        </Col>
      </Row>
    </Container>
  );
}
export default Home;
