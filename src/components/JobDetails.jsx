import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS
import { useUserContext } from "./UserContext";

const JobDetail = () => {
  const { id } = useParams();
  const { email: ctxEmail, username: ctxUsername } = useUserContext();
  
  // Getting email and username from context or localStorage as fallback
  const email = ctxEmail || localStorage.getItem("email");
  const username = ctxUsername || localStorage.getItem("username");

  const [userId] = useState(localStorage.getItem("userId"));
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedResume, setSelectedResume] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState([]);

  useEffect(() => {
    fetchJobDetails();
    fetchAppliedJobs(); // Call this function when the component loads
  }, [id]);

  // Fetch applied jobs using the email directly from context or localStorage
  const fetchAppliedJobs = async () => {
    try {
      const response = await fetch(`https://localhost:7235/api/jobapplication/applications/by-email?email=${email}`);
      console.log("Response from applied jobs fetch: ", response); // Log the response for debugging
      if (!response.ok) {
        throw new Error("You can Apply");
      }
      const data = await response.json();
      console.log("Fetched applied jobs data:", data); // Log the data to ensure correct response structure
      setAppliedJobs(data.map((application) => application.jobPostingId)); // Set the applied job IDs
    } catch (error) {
      console.error("Error fetching applied jobs:", error); // Log error for debugging
      
    }
  };

  const fetchJobDetails = async () => {
    try {
      const response = await fetch(`https://localhost:7235/api/jobposting/${id}`);
      if (!response.ok) throw new Error("Job not found");
      const data = await response.json();
      setJob(data);
    } catch (error) {
      
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    setSelectedResume(e.target.files[0]);
  };

  const handleApply = async () => {
    if (!selectedResume) return toast.warn("Please upload a resume before applying.");
    console.log("Applying with username:", username); 
    const formData = new FormData();
    formData.append("JobPostingId", job.id);
    formData.append("CandidateName", username); // Ensure username is set correctly
    formData.append("Email", email); // Using email directly from context
    formData.append("resume", selectedResume);

    try {
      const response = await fetch("https://localhost:7235/api/JobApplication/apply", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setAppliedJobs((prev) => [...prev, job.id]);
        toast.success("Application submitted successfully!");
      } else {
        const errorData = await response.json();
        toast.error(`Error: ${errorData.message || "Failed to apply"}`);
      }
    } catch (error) {
      console.error("Error applying:", error);
      toast.error("Application failed. Try again later.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading job details...</div>;
  if (!job) return <div className="text-center text-danger mt-5">Job not found.</div>;

  return (
    <motion.div
      className="container my-5"
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="card shadow-lg p-5 rounded-4 border-0">
        <motion.h2 className="text-primary mb-4" initial={{ x: -100 }} animate={{ x: 0 }} transition={{ duration: 0.5 }}>
          {job.title}
        </motion.h2>
        <p><strong>Description:</strong> {job.description}</p>
        <p><strong>Location:</strong> {job.location}</p>
        <p><strong>Salary:</strong> ₹{job.salary.toLocaleString()}</p>
        <p><strong>Deadline:</strong> {new Date(job.deadline).toLocaleDateString()}</p>
        <p><strong>Department:</strong> {job.department}</p>
        <p><strong>Job Type:</strong> {job.jobType}</p>
        <p><strong>Status:</strong> {job.status}</p>

        <div className="mt-4">
          <label className="form-label">Upload Resume:</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleResumeChange}
            className="form-control mb-2"
          />
        </div>

        <motion.button
          className={`btn ${appliedJobs.includes(job.id) ? "btn-outline-secondary" : "btn-outline-success"}`}
          onClick={handleApply}
          disabled={appliedJobs.includes(job.id)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          {appliedJobs.includes(job.id) ? "Applied" : "Apply Now"}
        </motion.button>

        <Link to="/" className="btn btn-outline-info mt-4">
          ← Back to Job Listings
        </Link>
      </div>

      <ToastContainer position="top-right" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
    </motion.div>
  );
};

export default JobDetail;
