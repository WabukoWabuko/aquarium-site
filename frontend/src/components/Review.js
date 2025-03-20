import React, { useState, useEffect } from 'react';
import { Form, Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

function Review({ serviceId, productId }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [csrfToken, setCsrfToken] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCsrfToken = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/csrf/', { 
          withCredentials: true,
          headers: { 'Content-Type': 'application/json' }
        });
        setCsrfToken(response.data.csrfToken);
      } catch (err) {
        console.error('Failed to fetch CSRF token:', err);
        setError('Couldn’t load CSRF token. Check browser cookie settings or log in.');
      }
    };
    fetchCsrfToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!csrfToken) {
      setError('CSRF token not loaded. Please wait or refresh.');
      return;
    }
    if (!serviceId && !productId) {
      setError('No service or product specified for this review.');
      return;
    }
    if (rating < 1 || rating > 5) {
      setError('Rating must be between 1 and 5.');
      return;
    }

    const data = {
      rating,
      comment,
      service: serviceId ? parseInt(serviceId) : null,
      product: productId ? parseInt(productId) : null,
    };

    try {
      const response = await axios.post('http://localhost:8000/api/reviews/', data, {
        withCredentials: true,
        headers: {
          'X-CSRFToken': csrfToken,
          'Content-Type': 'application/json',
        },
      });
      console.log('Review submitted:', response.data);
      alert('Review submitted successfully!');
      setRating(0);
      setComment('');
      setError(null);
    } catch (err) {
      console.error('Review submission failed:', err);
      if (err.response?.status === 403) {
        setError('Forbidden: Please log in or check browser cookie settings.');
      } else if (err.response?.status === 400) {
        setError(`Invalid data: ${JSON.stringify(err.response.data)}`);
      } else {
        setError('Submission failed: ' + (err.response?.statusText || 'Unknown error'));
      }
    }
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
                style={{ cursor: 'pointer', color: star <= rating ? '#ffd700' : '#ccc', fontSize: '1.5em' }}
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
              rows={2}
            />
          </Form.Group>
        </Col>
      </Row>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <Button type="submit" variant="success" size="sm" disabled={!csrfToken}>
        {csrfToken ? 'Submit Review' : 'Loading...'}
      </Button>
    </Form>
  );
}
export default Review;
