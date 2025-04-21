import React, { useEffect, useState } from "react";
import { useUserContext } from "./UserContext";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Sdjobs = () => {
  const { userId } = useUserContext();
  const [jobPostings, setJobPostings] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Check if the user is logged in. If not, navigate to the login page.
  useEffect(() => {
    fetchJobPostings();
  }, []);

  const fetchJobPostings = async () => {
    try {
      const department = encodeURIComponent("Software Development");
      const response = await fetch(`https://localhost:7235/api/jobposting/by-department?department=${department}`);
      if (!response.ok) throw new Error("Failed to fetch job postings");
      const data = await response.json();
      setJobPostings(data);
    } catch (error) {
      alert("Error fetching job postings.");
    } finally {
      setLoading(false);
    }
  };

  // Handle job click - navigate to login page if not logged in
  const handleJobClick = (jobId) => {
    if (!userId) {
      navigate("/candidate-login"); // Redirect to candidate login page if not logged in
    } else {
      navigate(`/job/${jobId}`); // Redirect to job details page if logged in
    }
  };

  if (loading) return <div className="text-center mt-5">Loading Software Development jobs...</div>;

  return (
    <motion.div
      className="container my-5 py-4 px-3 rounded-4"
      style={{
        background: "linear-gradient(to right, #f0f2f5, #e4ecf7)",
        boxShadow: "0 0 15px rgba(0,0,0,0.05)"
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
    >
      <div className="text-center mb-5">
        <motion.h2
          className="fw-bold"
          style={{ color: "#4e73df", fontFamily: "Segoe UI, sans-serif" }}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          💻 Software Development Job Openings
        </motion.h2>
        <p className="text-muted">Build, innovate, and ship code — explore top opportunities in software engineering!</p>
      </div>

      <div className="row">
        {jobPostings.map((job, index) => (
          <motion.div
            className="col-md-6 mb-4"
            key={job.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <div
              className="card h-100 p-4 border-0 rounded-4"
              style={{
                background: "#fff",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.05)";
              }}
              onClick={() => handleJobClick(job.id)} // Handle click
            >
              <h5 className="text-primary mb-2">{job.title}</h5>
              <p className="text-muted">{job.description}</p>
              <p><strong>📍 Location:</strong> {job.location}</p>
              <p><strong>💰 Salary:</strong> ₹{job.salary.toLocaleString()}</p>
              <p><strong>🗓️ Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default Sdjobs;
