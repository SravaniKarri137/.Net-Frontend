import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Button, Container, Row, Col, Modal, Form, InputGroup, FormControl } from 'react-bootstrap';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';  // Importing useNavigate
import { ToastContainer, toast } from 'react-toastify';

const ViewApplications = () => {
  const navigate = useNavigate();  // Initialize useNavigate
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({ jobType: '', location: '', department: '', status: '' });
  const [editModal, setEditModal] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;

  const fetchJobs = async () => {
    const res = await axios.get('https://localhost:7235/api/jobposting');
    setJobs(res.data);
    setFilteredJobs(res.data);
  };

  const fetchFilteredJobs = async () => {
    const { jobType, location, department, status } = filters;
    if (!jobType && !location && !department && !status) return fetchJobs();
    try {
      const res = await axios.get('https://localhost:7235/api/jobposting/by-job-type-location-status-department', {
        params: { jobType, location, department, status }
      });
      setJobs(res.data);
      setFilteredJobs(res.data);
      setCurrentPage(1);
    } catch (err) {
      setJobs([]);
      setFilteredJobs([]);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const deleteJob = async (id) => {
    await axios.delete(`https://localhost:7235/api/jobposting/${id}`);
    fetchJobs();
  };

  const handleEditClick = (job) => {
    setSelectedJob(job);
    setEditModal(true);
  };

  const handleEditChange = (e) => {
    setSelectedJob({ ...selectedJob, [e.target.name]: e.target.value });
  };

  const saveEdit = async () => {
    await axios.put(`https://localhost:7235/api/jobposting/${selectedJob.id}`, selectedJob);
    setEditModal(false);
    fetchJobs();
  };

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearch(value);
    const searched = jobs.filter((job) =>
      job.title.toLowerCase().includes(value)
    );
    setFilteredJobs(searched);
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const handlePageChange = (page) => setCurrentPage(page);

  return (
    <Container fluid className="mt-5 p-4" style={{ backgroundColor: '#f8f9fa', borderRadius: '15px', boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)' }}>
      <Row>
        {/* Sidebar (Search & Filters) */}
        <Col md={3} className="border-end" style={{ padding: '20px', backgroundColor: '#ffffff', position: 'sticky', top: '0' }}>
          <h4 className="text-center mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>🔍 Filter & Search</h4>

          {/* Search Bar */}
          <InputGroup className="mb-3">
            <FormControl
              placeholder="Search by title..."
              value={search}
              onChange={handleSearch}
              style={{ borderRadius: '8px', borderColor: '#007bff' }}
            />
          </InputGroup>

          {/* Filters */}
          <Form.Select name="jobType" value={filters.jobType} onChange={handleFilterChange} style={{ borderRadius: '8px', borderColor: '#007bff' }} className="mb-3">
            <option value="">Job Type</option>
            <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
          </Form.Select>

          <Form.Select name="location" value={filters.location} onChange={handleFilterChange} style={{ borderRadius: '8px', borderColor: '#007bff' }} className="mb-3">
            <option value="">Location</option>
            <option>Remote</option>
            <option>Pune</option>
            <option>Bengaluru</option>
            <option>Kolkata</option>
            <option>Chennai</option>
            <option>Noida</option>
            <option>Hyderabad</option>
          </Form.Select>

          <Form.Select name="department" value={filters.department} onChange={handleFilterChange} style={{ borderRadius: '8px', borderColor: '#007bff' }} className="mb-3">
            <option value="">Department</option>
            <option>Software Development</option>
            <option>Design & Creative</option>
            <option>Marketing & Sales</option>
          </Form.Select>

          <Form.Select name="status" value={filters.status} onChange={handleFilterChange} style={{ borderRadius: '8px', borderColor: '#007bff' }} className="mb-3">
            <option value="">Status</option>
            <option>Published</option>
            <option>Unpublished</option>
          </Form.Select>

          <Button variant="primary" onClick={fetchFilteredJobs} style={{ backgroundColor: '#007bff', borderColor: '#007bff', borderRadius: '8px' }}>
            Apply Filters
          </Button>
        </Col>

        {/* Job Listings */}
        <Col md={9}>
          <motion.div
            className="mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            style={{ maxHeight: 'calc(100vh - 100px)', overflowY: 'scroll' }}
          >
            <h2 className="text-center mb-4" style={{ color: '#343a40', fontWeight: 'bold' }}>📋 Job Postings</h2>

            {/* Display jobs in a vertical layout */}
            <div>
              {currentJobs.map((job) => (
                <motion.div key={job.id} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                  <Card className="shadow-lg border-0 rounded-4 mb-4" style={{ backgroundColor: '#ffffff', transition: 'transform 0.3s ease-in-out' }}>
                    <Card.Body>
                      <Card.Title className="fw-bold fs-5 mb-3" style={{ color: '#007bff' }}>💼 {job.title}</Card.Title>
                      <Card.Text style={{ color: '#495057' }}>
                        📍 <strong>Location:</strong> {job.location}<br />
                        💰 <strong>Salary:</strong> ${job.salary}<br />
                        🏢 <strong>Department:</strong> {job.department}<br />
                        ⏰ <strong>Type:</strong> {job.jobType}<br />
                        📅 <strong>Deadline:</strong> {job.deadline.substring(0, 10)}<br />
                        ✅ <strong>Status:</strong> {job.status}
                      </Card.Text>
                      <div className="d-flex justify-content-between">
                        <Button
                          variant="outline-primary"
                          onClick={() => handleEditClick(job)}
                          style={{ borderColor: '#007bff', borderRadius: '8px' }}
                        >
                          ✏️ Edit
                        </Button>
                        <Button
                          variant="outline-info"
                          onClick={() => navigate(`/view-applications/${job.id}/applicants`)}  // Using navigate() instead of history.push()
                          style={{ borderColor: '#17a2b8', borderRadius: '8px' }}
                        >
                          Applied By
                        </Button>

                        <Button
                          variant="outline-danger"
                          onClick={() => deleteJob(job.id)}
                          style={{ borderColor: '#dc3545', borderRadius: '8px' }}
                        >
                          🗑️ Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Pagination */}
          <Row className="mt-3">
            <Col className="d-flex justify-content-center">
              {[...Array(totalPages).keys()].map(num => (
                <Button
                  key={num + 1}
                  variant="outline-primary"
                  onClick={() => handlePageChange(num + 1)}
                  style={{ borderColor: '#007bff', borderRadius: '8px', margin: '0 5px' }}
                >
                  {num + 1}
                </Button>
              ))}
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Toast Container */}
      <ToastContainer />
    </Container>
  );
};

export default ViewApplications;
