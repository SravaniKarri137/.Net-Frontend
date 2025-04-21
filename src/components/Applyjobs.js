import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { motion } from "framer-motion";
import { Form, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const Applyjobs = () => {
  const { userId } = useUserContext();
  const [allJobs, setAllJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 4;
  const [search, setSearch] = useState("");

  const [filters, setFilters] = useState({
    jobType: "",
    location: "",
    status: "",
    department: ""
  });

  useEffect(() => {
    fetchAllJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [search, filters, allJobs]);

  const fetchAllJobs = async () => {
    try {
      const response = await fetch("https://localhost:7235/api/jobposting");
      const data = await response.json();
      setAllJobs(data);
    } catch (error) {
      alert("Error fetching job postings.");
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value.toLowerCase());
    setCurrentPage(1);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filterJobs = () => {
    const result = allJobs.filter((job) => {
      const matchesSearch = job.title.toLowerCase().includes(search);
      const matchesFilters =
        (!filters.jobType || job.jobType === filters.jobType) &&
        (!filters.location || job.location === filters.location) &&
        (!filters.status || job.status === filters.status) &&
        (!filters.department || job.department === filters.department);
      return matchesSearch && matchesFilters;
    });
    setFilteredJobs(result);
  };

  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container py-4">
      <h2 className="text-center mb-4">🚀 Job Opportunities</h2>

      {/* Compact search & filters layout */}
      <div className="d-flex flex-wrap gap-2 mb-4 align-items-center justify-content-center">
        <input
          type="text"
          className="form-control"
          placeholder="🔍 Search job title..."
          value={search}
          onChange={handleSearchChange}
          style={{ maxWidth: "200px" }}
        />
        <Form.Select name="jobType" value={filters.jobType} onChange={handleFilterChange} style={{ maxWidth: "160px" }}>
          <option value="">Job Type</option>
          <option>Full-Time</option>
            <option>Part-Time</option>
            <option>Internship</option>
        </Form.Select>
        <Form.Select name="location" value={filters.location} onChange={handleFilterChange} style={{ maxWidth: "160px" }}>
          <option value="">Location</option>
            <option>Remote</option>
            <option>Pune</option>
            <option>Bengaluru</option>
            <option>Kolkata</option>
            <option>Chennai</option>
            <option>Noida</option>
            <option>Hyderabad</option>
        </Form.Select>
        <Form.Select name="department" value={filters.department} onChange={handleFilterChange} style={{ maxWidth: "160px" }}>
          <option value="">Department</option>
          <option>Software Development</option>
            <option>Design & Creative</option>
            <option>Marketing & Sales</option>
        </Form.Select>
        <Form.Select name="status" value={filters.status} onChange={handleFilterChange} style={{ maxWidth: "160px" }}>
          <option value="">Status</option>
          <option>Published</option>
          <option>Unpublished</option>
        </Form.Select>
      </div>

      {/* Job list with clickable card */}
      {currentJobs.length === 0 ? (
        <div className="text-center text-danger">No jobs found.</div>
      ) : (
        currentJobs.map((job) => (
          <Link
            key={job.id}
            to={`/job/${job.id}`}
            className="text-decoration-none text-dark"
          >
            <motion.div
              className="card mb-3 p-3 shadow-sm rounded-4"
              whileHover={{ scale: 1.01 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <h5 className="text-primary fw-bold mb-2">💼 {job.title}</h5>
              <p className="mb-1">📍 <strong>Location:</strong> {job.location}</p>
              <p className="mb-1">💰 <strong>Salary:</strong> ${job.salary}</p>
              <p className="mb-1">🏢 <strong>Department:</strong> {job.department}</p>
              <p className="mb-1">⏰ <strong>Type:</strong> {job.jobType}</p>
              <p className="mb-1">📅 <strong>Deadline:</strong> {job.deadline?.substring(0, 10)}</p>
              <p className="mb-0">✅ <strong>Status:</strong> {job.status}</p>
            </motion.div>
          </Link>
        ))
      )}

      {/* Pagination */}
      <div className="d-flex justify-content-center mt-4">
        {Array.from({ length: totalPages }, (_, i) => (
          <Button
            key={i}
            className="mx-1"
            variant={currentPage === i + 1 ? "primary" : "outline-secondary"}
            onClick={() => paginate(i + 1)}
          >
            {i + 1}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default Applyjobs;
