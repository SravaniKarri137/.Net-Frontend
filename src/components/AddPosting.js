import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Form, Button, Container } from 'react-bootstrap';
import axios from 'axios';
 
const AddPosting = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    department: '',
    jobType: '',
    deadline: '',
    status: 'Published'  // Default value is 'Published'
  });
  const navigate = useNavigate();
 
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('https://localhost:7235/api/jobposting', formData);
      console.log("Job posted successfully:", response.data);
      navigate('/view-applications');
    } catch (error) {
      console.error("Error posting job:", error);
      alert('Error posting job');
    }
  };
 
 
  return (
    <Container className="mt-5">
      <h3>Add Job Posting</h3>
      <Form onSubmit={handleSubmit}>
        {['title', 'description', 'location', 'salary', 'department', 'jobType'].map((field) => (
          <Form.Group key={field} className="mb-3">
            <Form.Label>{field.charAt(0).toUpperCase() + field.slice(1)}</Form.Label>
            <Form.Control
              type="text"
              name={field}
              value={formData[field]}
              onChange={handleChange}
              required
            />
          </Form.Group>
        ))}
 
        {/* Deadline input (Date picker) */}
        <Form.Group className="mb-3">
          <Form.Label>Deadline</Form.Label>
          <Form.Control
            type="date"
            name="deadline"
            value={formData.deadline}
            onChange={handleChange}
            required
          />
        </Form.Group>
 
        {/* Status dropdown */}
        <Form.Group className="mb-3">
          <Form.Label>Status</Form.Label>
          <Form.Control
            as="select"
            name="status"
            value={formData.status}
            onChange={handleChange}
            required
          >
            <option value="Published">Published</option>
            <option value="Unpublished">Unpublished</option>
          </Form.Control>
        </Form.Group>
 
        <Button type="submit" variant="primary">Submit</Button>
      </Form>
    </Container>
  );
};
 
export default AddPosting;
 