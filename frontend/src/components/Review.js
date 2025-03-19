import React, { useState } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Review({ serviceId, productId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = { rating, comment, service: serviceId, product: productId };
    axios.post('http://127.0.0.1:8000/api/reviews/', data)
      .then(() => {
        alert('Review submitted!');
        setRating(0);
        setComment('');
      })
      .catch(error => console.error(error));
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Row>
        <Col>
          <Form.Label>Rating (1-5):</Form.Label>
          <div>
            {[1, 2, 3, 4, 5].map(star => (
              <span
                key={star}
                style={{ cursor: 'pointer', color: star <= rating ? '#ffd700' : '#ccc' }}
                onClick={() => setRating(star)}
              >
                ★
              </span>
            ))}
          </div>
        </Col>
      </Row>
      <Row>
        <Col>
          <Form.Group>
            <Form.Label>Comment</Form.Label>
            <Form.Control
              as="textarea"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Col>
      </Row>
      <Button type="submit" variant="success">Submit Review</Button>
    </Form>
  );
}
export default Review;
