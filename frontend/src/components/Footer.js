import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

function Footer() {
  return (
    <footer style={{ backgroundColor: '#0077b6', color: 'white', padding: '20px 0', marginTop: 'auto' }}>
      <Container>
        <Row>
          <Col>
            <p>&copy; 2025 Topher's Aquarium. All rights reserved.</p>
            <p>Contact: christopher@gmail.com | +2547123456789</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
}
export default Footer;
